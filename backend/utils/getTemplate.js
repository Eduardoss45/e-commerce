const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

function getTemplate(template_name, data) {
  const file_path = path.join(__dirname, '..', 'emails', 'dist', `${template_name}.hbs`);

  if (!fs.existsSync(file_path)) {
    throw new Error(`Template "${template_name}.hbs" não encontrado em ${file_path}`);
  }

  const template_source = fs.readFileSync(file_path, 'utf-8');
  const template = handlebars.compile(template_source);
  return template(data);
}

module.exports = getTemplate;
