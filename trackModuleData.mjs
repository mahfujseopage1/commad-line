import fs from 'fs';
import cheerio from 'cheerio';



const path = 'C:\\laragon\\www\\projectDashboard\\public';

export const trackModuleData = async () => {
  try {
    const chartData = await getModuleDataArray();

    const baseData = {
      vendorFile: getMainFileData(chartData, "/js/vendor.js"),
      mainFile: getMainFileData(chartData, "/js/react/app.js"),
      workingModule: getWorkingModuleData(chartData, "./resources/js/react/projects")
    }

    const mainPayload = updateJSONFile(baseData)
    return mainPayload
  } catch (error) {
    console.log("error in trackModuleData", error)
  }
}

const getModuleDataArray = async (data) => {
  try {
    const files = fs.readdirSync(path)
    const findReportFile = files.find(file => file.includes("report"))
    if (findReportFile) {
      const data = fs.readFileSync(`${path}/${findReportFile}`, 'utf8')
      const $ = cheerio.load(data)
      const bodyScripts = $('body script');
      let chartData = null;
      bodyScripts.each((i, script) => {
        const scriptText = $(script).html();
        if (scriptText.includes('window.chartData =')) {
          const startIndex = scriptText.indexOf('window.chartData =') + 'window.chartData ='.length;
          const endIndex = scriptText.indexOf('window.entrypoints =');
          const chartDataString = scriptText.substring(startIndex, endIndex).trim();
          const cleanedChartDataString = chartDataString.replace(/;$/, '');
          chartData = JSON.parse(cleanedChartDataString);
          fs.writeFileSync(`chartData.json`, JSON.stringify(chartData, null, 2));
          return false;
        }
      });
      return chartData;
    }
  } catch (error) {
    console.log("error in getModuleDataArray", error)
  }

}




const getMainFileData = (chartData, fileName, isOtherNeed = false) => {
  try {
    const fileData = chartData?.find(module => module.label.includes(fileName))
    const baseData = {
      fileName: fileName,
      fileSize: formatBytes(fileData?.statSize),
      fileGzippedSize: formatBytes(fileData?.parsedSize),
      fileMinifiedSize: formatBytes(fileData?.gzipSize),
    };
    return isOtherNeed ? { ...fileData, ...baseData } : baseData;
  } catch (error) {
    console.log("error in getfileData", error)
  }
}


const getWorkingModuleData = (chartData, fileName, isOtherNeed = false) => {
  const findReact = getMainFileData(chartData, "/js/react/app.js", true)
  const findResources = findReact?.groups[0]?.groups?.find(item => item.path === "./resources/js")
  const findOldReact = findResources?.groups?.find(item => item.path === "./resources/js/react")
  const moduleData = findOldReact?.groups.find(item => item.path === fileName)
  const baseData = {
    fileName: fileName,
    fileSize: formatBytes(moduleData?.statSize),
    fileGzippedSize: formatBytes(moduleData?.parsedSize),
    fileMinifiedSize: formatBytes(moduleData?.gzipSize),
  };
  return isOtherNeed ? { ...moduleData, ...baseData } : baseData;
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const storeData = async () => {

}

const updateJSONFile = (data) => {
  try {
    const filePath = "./db.json"

    let fileData = [];

    if (fs.existsSync(filePath)) {
      const existingData = fs.readFileSync(filePath, 'utf8');
      fileData = JSON.parse(existingData);
    }

    const payload = {
      vendor: data.vendorFile,
      mainFile: data.mainFile,
      workingModule: data.workingModule,
      createdTime: new Date().toISOString()
    }
    fileData.push(payload)
    fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');
    return payload
  } catch (error) {
    console.error('Error updating JSON file:', error);
  }
};