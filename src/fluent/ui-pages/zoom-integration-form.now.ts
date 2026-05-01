import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import zoomIntegrationForm from '../../client/zoom-integration-form.html';

export const zoom_integration_form_page = UiPage({
  $id: Now.ID['zoom_integration_form_page'],
  endpoint: 'x_1842120_hubby_zoom_integration_form.do',
  description: 'Zoom Integration Form widget for creating Zoom integrations',
  category: 'general',
  html: zoomIntegrationForm,
  direct: true
});