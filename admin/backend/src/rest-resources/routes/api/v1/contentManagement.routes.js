import { BannerController } from '@src/rest-resources/controllers/contentManagement/banner.controller'
import { GalleryController } from '@src/rest-resources/controllers/contentManagement/gallery.controller'
import { PageController } from '@src/rest-resources/controllers/contentManagement/page.controller'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { fileUpload } from '@src/rest-resources/middlewares/multer'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import express from 'express'
import { successSchema } from '@src/schema/successResponse.schema'
import { createPageSchema } from '@src/schema/content/createPage.schema'
import { galleryUploadSchema } from '@src/schema/content/galleryUpload.schema'
import { getPageSchema } from '@src/schema/content/getPage.schema'
import { getGallerySchema } from '@src/schema/content/getGallery.schema'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { SeoPageController } from '@src/rest-resources/controllers/contentManagement/seoPage.controller'
import { EmailTemplateController } from '@src/rest-resources/controllers/contentManagement/emailTemplate.controller'
import { TestimonialController } from '@src/rest-resources/controllers/contentManagement/testimonial.controller'
import { testimonialSchema } from '@src/schema/content/testimonial.schema'
import { createTestimonialSchema } from '@src/schema/content/createTestimonial.schema'
import { requestValidationMiddleware } from '@src/rest-resources/middlewares/requestValidation.middleware'

const supportedFileFormats = ['png', 'jpg', 'jpeg', 'tiff', 'svg+xml', 'webp', 'svg']
const contentManagementRoutes = express.Router({ mergeParams: true })

// GET REQUESTS
contentManagementRoutes.get('/page', isAuthenticated(resources.page.read), PageController.getPage, responseValidationMiddleware(createPageSchema))
contentManagementRoutes.get('/pages', isAuthenticated(resources.page.read), PageController.getPages, responseValidationMiddleware(getPageSchema))
contentManagementRoutes.get('/banner', isAuthenticated(resources.banner.read), BannerController.getBanners, responseValidationMiddleware({}))
contentManagementRoutes.get('/gallery', isAuthenticated(), GalleryController.getImages, responseValidationMiddleware(getGallerySchema))
contentManagementRoutes.get('/seo/page', isAuthenticated(resources.seoPage.read), SeoPageController.getSeoPage, responseValidationMiddleware({}))
contentManagementRoutes.get('/seo/pages', isAuthenticated(resources.seoPage.read), SeoPageController.getSeoPages, responseValidationMiddleware({}))
contentManagementRoutes.get('/email-templates', isAuthenticated(resources.emailTemplate.read), EmailTemplateController.getEmailTemplates, responseValidationMiddleware({}))
contentManagementRoutes.get('/email-template', isAuthenticated(resources.emailTemplate.read), EmailTemplateController.getEmailTemplate, responseValidationMiddleware({}))

// POST REQUESTS
contentManagementRoutes.post('/page/create', isAuthenticated(resources.page.create), databaseTransactionHandlerMiddleware, PageController.createPage, responseValidationMiddleware(createPageSchema))
contentManagementRoutes.post('/page/toggle', isAuthenticated(resources.page.toggle_status), PageController.togglePage, responseValidationMiddleware(successSchema))
// contentManagementRoutes.post('/banner/upload', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormats).fields([{ name: 'imageUrl', maxCount: 1 }, { name: 'mobileImageUrl', maxCount: 1 }]), BannerController.uploadBanner, responseValidationMiddleware({}))
contentManagementRoutes.post('/banner/upload', isAuthenticated(), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormats).any(), BannerController.uploadBanner, responseValidationMiddleware({}))
contentManagementRoutes.post('/gallery/upload', isAuthenticated(resources.gallery.update), databaseTransactionHandlerMiddleware, fileUpload(supportedFileFormats).single('file'), GalleryController.uploadGalleryImage, responseValidationMiddleware(galleryUploadSchema))
contentManagementRoutes.post('/seo/page', isAuthenticated(resources.seoPage.create), databaseTransactionHandlerMiddleware, SeoPageController.createSeoPage, responseValidationMiddleware(successSchema))
contentManagementRoutes.post('/email-template', isAuthenticated(resources.emailTemplate.create), EmailTemplateController.createEmailTemplate, responseValidationMiddleware({}))
contentManagementRoutes.post('/email-template/set-default', isAuthenticated(resources.emailTemplate.update), EmailTemplateController.setDefaultEmailTemplate, responseValidationMiddleware(successSchema))
contentManagementRoutes.post('/page/update', isAuthenticated(resources.page.update), PageController.updatePage, responseValidationMiddleware(successSchema))

// PUT REQUEST
contentManagementRoutes.put('/seo/page', isAuthenticated(resources.seoPage.update), databaseTransactionHandlerMiddleware, SeoPageController.updateSeoPage, responseValidationMiddleware(successSchema))
contentManagementRoutes.put('/email-template', isAuthenticated(resources.emailTemplate.update), EmailTemplateController.updateEmailTemplate, responseValidationMiddleware({}))

// DELETE REQUESTS
contentManagementRoutes.delete('/page', isAuthenticated(resources.page.delete), PageController.deletePage, responseValidationMiddleware({}))
contentManagementRoutes.delete('/banner', isAuthenticated(resources.page.delete), databaseTransactionHandlerMiddleware, BannerController.deleteBanner, responseValidationMiddleware({}))
contentManagementRoutes.delete('/gallery', isAuthenticated(resources.gallery.delete), databaseTransactionHandlerMiddleware, GalleryController.deleteGalleryImage, responseValidationMiddleware(successSchema))
contentManagementRoutes.delete('/seo/page', isAuthenticated(resources.seoPage.delete), databaseTransactionHandlerMiddleware, SeoPageController.deleteSeoPage, responseValidationMiddleware(successSchema))
contentManagementRoutes.delete('/email-template', isAuthenticated(resources.emailTemplate.delete), EmailTemplateController.deleteEmailTemplate, responseValidationMiddleware(successSchema))

// Testimonial CRUD
contentManagementRoutes.get('/testimonials', isAuthenticated(resources.testimonial.read), TestimonialController.getTestimonials, responseValidationMiddleware(testimonialSchema))
contentManagementRoutes.get('/testimonial', isAuthenticated(resources.testimonial.read), TestimonialController.getTestimonial, responseValidationMiddleware(testimonialSchema))
contentManagementRoutes.post('/testimonial', isAuthenticated(resources.testimonial.create), requestValidationMiddleware(createTestimonialSchema), databaseTransactionHandlerMiddleware, TestimonialController.createTestimonial, responseValidationMiddleware(testimonialSchema))
contentManagementRoutes.put('/testimonial', isAuthenticated(resources.testimonial.update), databaseTransactionHandlerMiddleware, TestimonialController.updateTestimonial, responseValidationMiddleware(testimonialSchema))
contentManagementRoutes.delete('/testimonial', isAuthenticated(resources.testimonial.delete), databaseTransactionHandlerMiddleware, TestimonialController.deleteTestimonial, responseValidationMiddleware({}))

export { contentManagementRoutes }
