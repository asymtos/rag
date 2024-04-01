export const titleCase = (str) => {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}

export const timeDiffrence = (str) => {
    const targetTime = new Date(str);
    const currentTime = new Date();
    const differenceInSeconds = Math.floor((currentTime - targetTime) / 1000);
    const seconds = differenceInSeconds % 60;
    const minutes = Math.floor(differenceInSeconds / 60) % 60;
    const hours = Math.floor(differenceInSeconds / 3600) % 24;
    const days = Math.floor(differenceInSeconds / 86400);
    //const formattedDifference = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds ago`;
    const formattedDifference = `${minutes}m ago`;
    return formattedDifference
}

export const CalculateAverageMemoryUsage = (data) => {
    if (data.length === 0) {
        return 0; // Return 0 if there's no data
    }
    const totalUsage = data.reduce((sum, data) => sum + data.y, 0);
    const averageUsage = totalUsage / data.length;
    return averageUsage.toFixed(2);
}

export const CalculateMaxMemoryUsage = (data) => {
    if (data.length === 0) {
        return { min: 0, max: 0 }; // Return default values if there's no data
    }
    let minValue = data[0].y;
    let maxValue = data[0].y;
    for (let i = 1; i < data.length; i++) {
        const usage = data[i].y;
        if (usage < minValue) {
            minValue = usage;
        }
        if (usage > maxValue) {
            maxValue = usage;
        }
    }
    return maxValue.toFixed(2);
}

export const CalculateMinMemoryUsage = (data) => {
    if (data.length === 0) {
        return { min: 0, max: 0 }; // Return default values if there's no data
    }
    let minValue = data[0].y;
    let maxValue = data[0].y;
    for (let i = 1; i < data.length; i++) {
        const usage = data[i].y;
        if (usage < minValue) {
            minValue = usage;
        }
        if (usage > maxValue) {
            maxValue = usage;
        }
    }
    return minValue;
}

export const ConvertImageToInt64Array = (imageFile) => {
    function bigIntToInt64Bytes(value) {
        const bytes = new Uint8Array(8); // 8 bytes for a 64-bit integer
        let intValue = BigInt.asIntN(64, value); // Ensure the value fits within 64 bits
        for (let i = 7; i >= 0; i--) {
            bytes[i] = Number(intValue & BigInt(0xFF)); // Extract the lowest 8 bits
            intValue >>= BigInt(8); // Shift right by 8 bits
        }
        return bytes;
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryData = event.target.result;

            const bigIntValue = BigInt("0x" + Array.from(new Uint8Array(binaryData), byte => byte.toString(16).padStart(2, '0')).join(''));

            const int64Bytes = bigIntToInt64Bytes(bigIntValue);

            resolve(int64Bytes);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        // Read the image file as a binary blob
        reader.readAsArrayBuffer(imageFile);
    });
}


export const ConvertImageToIntBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const srcData = event.target.result;
            let data = srcData.split(',');
            resolve(data[1]);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        // Read the image file as a binary blob
        reader.readAsDataURL(imageFile);
    });
}
