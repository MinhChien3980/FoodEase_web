const fs = require("fs");
const path = require("path");

function generateHtaccess() {
  const outputPath = path.join(__dirname, "dist", ".htaccess");
  const htaccessContent = `<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
     
    # Dynamic routes
    RewriteRule ^categories/([^/]+)/?$ categories/[slug]/index.html [L]
    RewriteRule ^products/([^/]+)/?$ products/[slug]/index.html [L]
    RewriteRule ^restaurants/([^/]+)/?$ restaurants/[slug]/index.html [L]
    RewriteRule ^exclusiveProducts/([^/]+)/?$ exclusiveProducts/[slug]/index.html [L]
    
    # If the request is not for a valid directory
    RewriteCond %{REQUEST_FILENAME} !-d
    # If the request is not for a valid file
    RewriteCond %{REQUEST_FILENAME} !-f
    # If the request is not for a valid link
    RewriteCond %{REQUEST_FILENAME} !-l

    # Rewrite all other URLs to index.html
    RewriteRule . index.html [L]
</IfModule>`;

  // Write the content to .htaccess file
  fs.writeFileSync(outputPath, htaccessContent.trim());
  console.log(".htaccess file has been generated successfully.");
}

generateHtaccess();
