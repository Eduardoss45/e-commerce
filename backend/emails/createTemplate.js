const juice = require('juice');
const fs = require('fs');
const path = require('path');

function convert(template_name, style_name, output_name) {
  const template_path = path.join(__dirname, 'templates', template_name);
  const style_path = path.join(__dirname, 'scss', style_name);
  const output_path = path.join(__dirname, 'dist', output_name);

  const html = fs.readFileSync(template_path, 'utf-8');
  const css = fs.readFileSync(style_path, 'utf-8');

  const result = juice.inlineContent(html, css);

  if (!fs.existsSync(path.join(__dirname, 'dist'))) {
    fs.mkdirSync(path.join(__dirname, 'dist'));
  }

  fs.writeFileSync(output_path, result, 'utf-8');
}

convert('code.html', 'code.css', 'code.hbs');
