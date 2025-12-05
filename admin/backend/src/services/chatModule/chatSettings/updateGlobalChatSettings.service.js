import { APIError } from "@src/errors/api.error";
import ajv from "@src/libs/ajv";
import { ServiceBase } from "@src/libs/serviceBase";

const constraints = ajv.compile({
  type: "object",
  properties: {
    configurations: { type: ["string", "array"] },
  },
  required: ["configurations"],
});

export default class UpdateGlobalChatSettings extends ServiceBase {
  get constraints() {
    return constraints;
  }

  async run() {
    const { chatSetting: chatSettingModel } = this.context.sequelize.models;

    const transaction = this.context.sequelizeTransaction;
    let { configurations } = this.args;

    try {
      const promiseArr = [];
      configurations =
        typeof configurations === "string"
          ? JSON.parse(configurations)
          : configurations;
      configurations = configurations || [];
      console.log("saikat configurations", configurations)
      const chatSlugs = configurations.reduce((acc, current) => {
        const x = acc.find((item) => item.slug.trim() === current.slug.trim());
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []).map((item) => item.slug.trim());

      if (!chatSlugs.length)
        return this.addError("ChatSettingsNotFoundErrorType");
      const chatSettingsAvailable = await chatSettingModel.findAll({
        where: {
          slug: chatSlugs,
        },
        raw: true,
      });

      if (chatSettingsAvailable.length !== Object.keys(configurations).length) {
        return this.addError("InvalidChatSettingsErrorType");
      }

      configurations.forEach((config) => {
        if (
          (config.value || "").trim() !== "" &&
          (config.slug || "").trim() !== ""
        ) {
          promiseArr.push(
            chatSettingModel.update(
              {
                value:
                  ["true", "false"].indexOf((config.value || "").trim()) > -1
                    ? (
                        (config.value || "").trim() === "true"
                        ? true
                        : false
                      )
                    : (config.value || "").trim(),
              },
              {
                where: { slug: (config.slug || "").trim() },
                transaction,
              },
            ),
          );
        }
      });

      if (promiseArr.length) {
        await Promise.all(promiseArr);
      }

      return { success: true };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
