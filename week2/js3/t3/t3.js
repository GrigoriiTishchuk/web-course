// Finnish month names
const finnishMonths = [
    "tammikuuta",    
    "helmikuuta",    
    "maaliskuuta",   
    "huhtikuuta",    
    "toukokuuta",    
    "kesäkuuta",     
    "heinäkuuta",    
    "elokuuta",      
    "syyskuuta",     
    "lokakuuta",     
    "marraskuuta",   
    "joulukuuta"     
];

// Function to detect browser name and version
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";
    
    // Check for different browsers
    if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edg") === -1) {
        browserName = "Google Chrome";
        const version = userAgent.match(/Chrome\/([\d.]+)/);
        browserVersion = version ? version[1].split('.')[0] : "Unknown";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
        const version = userAgent.match(/Firefox\/([\d.]+)/);
        browserVersion = version ? version[1].split('.')[0] : "Unknown";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
        browserName = "Apple Safari";
        const version = userAgent.match(/Version\/([\d.]+)/);
        browserVersion = version ? version[1].split('.')[0] : "Unknown";
    } else if (userAgent.indexOf("Edg") > -1) {
        browserName = "Microsoft Edge";
        const version = userAgent.match(/Edg\/([\d.]+)/);
        browserVersion = version ? version[1].split('.')[0] : "Unknown";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
        const version = userAgent.match(/(MSIE |rv:)([\d.]+)/);
        browserVersion = version ? version[2].split('.')[0] : "Unknown";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
        browserName = "Opera";
        const version = userAgent.match(/(Opera|OPR)\/([\d.]+)/);
        browserVersion = version ? version[2].split('.')[0] : "Unknown";
    }
    
    return { name: browserName, version: browserVersion };
}

// Function to detect operating system
function getOS() {
    const platform = navigator.platform;
    const userAgent = navigator.userAgent;
    let os = "Unknown";
    if (userAgent.indexOf("Win") > -1) {
        if (userAgent.indexOf("Windows NT 10.0") > -1) os = "Windows 10/11";
        else if (userAgent.indexOf("Windows NT 6.3") > -1) os = "Windows 8.1";
        else if (userAgent.indexOf("Windows NT 6.2") > -1) os = "Windows 8";
        else if (userAgent.indexOf("Windows NT 6.1") > -1) os = "Windows 7";
        else os = "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
        os = "macOS";
    } else if (userAgent.indexOf("Linux") > -1) {
        os = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
        os = "Android";
    } else if (userAgent.indexOf("like Mac") > -1) {
        os = "iOS";
    } else if (platform.indexOf("Win") > -1) {
        os = "Windows";
    } else if (platform.indexOf("Mac") > -1) {
        os = "macOS";
    } else if (platform.indexOf("Linux") > -1) {
        os = "Linux";
    }
    
    return os;
}

// Function to format date in Finnish
function getFinnishDate() {
    const now = new Date();
    const day = now.getDate();
    const month = finnishMonths[now.getMonth()];
    const year = now.getFullYear();
    return `${day}. ${month} ${year}`;
}

// Function to format time (hours and minutes)
function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
}

// Main function to display all information
function displayInfo() {
    const target = document.getElementById("target");
    const browser = getBrowserInfo();
    const os = getOS();
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    
    // Get available screen space
    const availWidth = screen.availWidth;
    const availHeight = screen.availHeight;
    const finnishDate = getFinnishDate();
    const currentTime = getFormattedTime();
    
    // Build HTML content
    let html = "";
    
    html += `<p><strong>Browser Name:</strong> <span>${browser.name}</span></p>`;
    html += `<p><strong>Browser Version:</strong> <span>${browser.version}</span></p>`;
    html += `<p><strong>Operating System:</strong> <span>${os}</span></p>`;
    html += `<p><strong>Screen Width:</strong> <span>${screenWidth} pixels</span></p>`;
    html += `<p><strong>Screen Height:</strong> <span>${screenHeight} pixels</span></p>`;
    html += `<p><strong>Available Screen Width:</strong> <span>${availWidth} pixels</span></p>`;
    html += `<p><strong>Available Screen Height:</strong> <span>${availHeight} pixels</span></p>`;
    html += `<p><strong>Current Date (Finnish):</strong> <span>${finnishDate}</span></p>`;
    html += `<p><strong>Current Time:</strong> <span>${currentTime}</span></p>`;
    
    // Additional BOM information
    html += `<p><strong>User Agent:</strong> <span style="font-size: 12px; word-break: break-all;">${navigator.userAgent}</span></p>`;
    
    target.innerHTML = html;
}

// Display information when page loads
window.onload = displayInfo;