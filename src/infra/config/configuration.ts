import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { App } from './app.config';

const YAML_CONFIG_FILENAME = 'config.yaml';


export default (): App => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as App;
};
