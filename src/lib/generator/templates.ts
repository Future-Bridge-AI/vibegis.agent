export const manifestTemplate = `{
  "name": "{{WIDGET_NAME}}",
  "label": "{{WIDGET_LABEL}}",
  "type": "widget",
  "version": "1.0.0",
  "exbVersion": "1.14.0",
  "author": "BMAD Generator",
  "description": "{{WIDGET_DESCRIPTION}}",
  "dependency": [{{JIMU_DEPENDENCIES}}],
  "translatedLocales": ["default"],
  "properties": {
    "hasSettingPage": {{HAS_SETTINGS}}
  }
}`;

export const configTemplate = `export interface Config {
{{SETTINGS_INTERFACE}}
}

export const defaultConfig: Config = {
{{SETTINGS_DEFAULTS}}
};
`;

export const widgetTemplate = `import { React, type AllWidgetProps } from "jimu-core";
{{JIMU_ARCGIS_IMPORT}}

const {{COMPONENT_NAME}} = (props: AllWidgetProps<unknown>) => {
  return (
    <div className="{{WIDGET_NAME}}">
      <h3>{{WIDGET_LABEL}}</h3>
      <p>{{WIDGET_DESCRIPTION}}</p>
      {{MAP_VIEW_PLACEHOLDER}}
      {{DATA_SOURCE_PLACEHOLDER}}
    </div>
  );
};

export default {{COMPONENT_NAME}};
`;

export const settingTemplate = `import { React, type AllWidgetSettingProps } from "jimu-core";
import { type Config } from "../config";

const Setting = (props: AllWidgetSettingProps<Config>) => {
  const { config } = props;

  return (
    <div className="settings">
      <h3>{{WIDGET_LABEL}} Settings</h3>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
};

export default Setting;
`;

export const translationTemplate = `export default {
  _widgetLabel: "{{WIDGET_LABEL}}"
};
`;
