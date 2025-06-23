const fs = require('fs');
const path = require('path');

const masterHeaderPath = path.join(__dirname, 'includes', 'header.html');
const projectRoot = __dirname;

if (!fs.existsSync(masterHeaderPath)) {
    console.error('Master header file not found at includes/header.html');
    process.exit(1);
}

const masterHeaderContent = fs.readFileSync(masterHeaderPath, 'utf8');

const headMatch = masterHeaderContent.match(/<head>[\s\S]*?<\/head>/);
const navMatch = masterHeaderContent.match(/<nav[\s\S]*?<\/nav>/);

if (!headMatch || !navMatch) {
    console.error('Could not find <head> or <nav> in master header file.');
    process.exit(1);
}

const masterHead = headMatch[0];
const masterNav = navMatch[0];

const files = fs.readdirSync(projectRoot);
const htmlFiles = files.filter(file => file.endsWith('.html') && !file.startsWith('base-template'));

htmlFiles.forEach(fileName => {
    try {
        const filePath = path.join(projectRoot, fileName);
        let fileContent = fs.readFileSync(filePath, 'utf8');

        const titleMatch = fileContent.match(/<title>(.*?)<\/title>/);
        const originalTitle = titleMatch ? titleMatch[1] : 'Expandia';
        
        const descriptionMatch = fileContent.match(/<meta name="description" content="(.*?)"/);
        const originalDescription = descriptionMatch ? descriptionMatch[1] : 'AI Solutions for Business Growth';

        let newHead = masterHead.replace('{{PAGE_TITLE}}', originalTitle);
        newHead = newHead.replace('{{PAGE_DESCRIPTION}}', originalDescription);
        
        fileContent = fileContent.replace(/<head>[\s\S]*?<\/head>/, newHead);

        const headerRegex = /<header class="navbar[\s\S]*?<\/header>/;
        if (headerRegex.test(fileContent)) {
             fileContent = fileContent.replace(headerRegex, masterNav);
        }

        fs.writeFileSync(filePath, fileContent, 'utf8');
        console.log(`Successfully unified header for: ${fileName}`);
    } catch (error) {
        console.error(`Failed to update ${fileName}:`, error);
    }
});

console.log('Header unification complete.');
