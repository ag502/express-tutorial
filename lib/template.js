module.exports = {
  HTML: (title, list, body, control) => {
    return `
            <!doctype html>
            <html>
                <head>
                    <title>${title}</title>
                    <meta charset='utf-8'>
                </head>
                <body>
                    <h1><a href='/'>WEB</a></h1>
                    ${list}
                    ${control}
                    ${body}
                </body>
            </html>
        `;
  },
  list: (fileList) => {
    const files = fileList
      .map((file, idx) => {
        return `
            <li><a href='/page/${file}'>${file}</a></li>
        `;
      })
      .join('');
    return `
      <ul>
          ${files}
      </ul>
    `;
  },
};
