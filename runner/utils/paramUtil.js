
module.exports = {
    getParamsData() {
        let paramsData = process.env.PARAMS_DATA;
        if (!paramsData) {
            return null;
        }
    
        paramsData = Buffer.from(paramsData, "base64").toString();
        return JSON.parse(paramsData)
    }
}