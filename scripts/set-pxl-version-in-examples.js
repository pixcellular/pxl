const fs = require("fs");
const { execSync } = require("child_process");

const args = process.argv.slice(2);
const newVersion = args[0];
if (!newVersion) {
  console.info('Usage: node set-pxl-version-in-examples.js [<version>|"dist"]');
  return;
}

const isDist = newVersion === 'dist';
const replacement = isDist
    ? '../../dist'
    : newVersion;

const examplesWithPackageJson = [
  'conway',
  'herbivore',
];

examplesWithPackageJson.forEach(example => {
  const examplePath = `./examples/${example}`
  const packageJsonPath = `${examplePath}/package.json`
  const json = JSON.parse(fs.readFileSync(packageJsonPath).toString());
  json.dependencies.pixcellular = replacement;
  fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 2));
});

const htmlExamples = [
  'vanilla'
];

htmlExamples.forEach(example => {
  const examplePath = `./examples/${example}`
  const indexPath = `${examplePath}/index.html`
  const html = fs.readFileSync(indexPath).toString();
  const replacementSrc = isDist
      ? `${replacement}/index.js`
      : `https://unpkg.com/pixcellular@${replacement}/index.js`;
  const replacementScriptTag = `    <script data-search-needle="pxl-dependency" src="${replacementSrc}"></script>`;
  const update = html.replace(
      /^.*pxl-dependency.*$/mg,
      replacementScriptTag
  );
  fs.writeFileSync(indexPath, update);
});

// Build after all examples dependencies are updated:
examplesWithPackageJson.forEach(example => {
  const examplePath = `./examples/${example}`
  runNpmInstallIn(examplePath);
});

function runNpmInstallIn(path) {
  const command = `cd ${path} && npm i && npm run build`;
  console.log('Running: ' + command);
  execSync(command, (error, stdout, stderr) => {
    if (error) {
      throw Error('Could not run npm i in ' + path, error);
    }
    if (stderr) {
      throw Error('Could not run npm i in ' + path +': ' + stderr);
    }
    console.log(stdout);
  });
}

