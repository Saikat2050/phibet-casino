import { APIError } from "@src/errors/api.error";
import { ServiceBase } from "@src/libs/serviceBase";

export default class FetchGlobalChatSettings extends ServiceBase {

  async run() {
    const { chatSetting: chatSettingModel } = this.context.sequelize.models;

    try {
      const chatSettingsAvailable = await chatSettingModel.findAll({
        raw: true,
      });

      return { success: true, chatSettingsAvailable };
    } catch (error) {
      throw new APIError(error);
    }
  }
}
