/* eslint no-process-exit: "off" */
const semver = require('semver');
const packageInfo = require('../package.json');
const { yellow, red, green } = require('./util/console');

module.exports = hexo => {
    function checkDependency(name, reqVer) {
        try {
            require.resolve(name);
            const version = require(name + '/package.json').version;
            if (!semver.satisfies(version, reqVer)) {
                console.error(`Package ${yellow(name)}'s version (${yellow(version)}) does not satisfy the required version (${red(reqVer)}).`);
                return false;
            }
            return true;
        } catch (e) {
            console.error(`Package ${yellow(name)} is not installed.`);
        }
        return false;
    }

    console.info('[Nexmoe] Checking package dependencies');
    const dependencies = Object.assign({}, packageInfo.dependencies);
    const missingDeps = Object.keys(dependencies)
        .filter(name => !checkDependency(name, dependencies[name]));
    if (missingDeps && missingDeps.length) {
        console.warn('[Nexmoe] 以下依赖版本与主题声明不完全一致，但构建将继续：');
        console.warn('npm install --save ' + missingDeps.map(name => `${name}@${dependencies[name]}`).join(' '));
        // 原代码会执行 process.exit(-1) 中断构建，这里注释掉，避免 Hexo 7 下无法部署
        // process.exit(-1);
    }
};
