/**
 * Custom blocks
 */
//% color=#0fbc11 icon="\uf1eb"
namespace ThingsBoard {

    let wifi_connected: boolean = false
    let thingsboard_connected: boolean = false
    let last_upload_successful: boolean = false
    let toSendStr = ""

    // write AT command with CR+LF ending
    function sendAT(command: string, wait: number = 0) {
        serial.writeString(command + "\u000D\u000A")
        basic.pause(wait)
    }

    // wait for certain response from ESP8266
    function waitResponse(): boolean {
        let serial_str: string = ""
        let result: boolean = false
        let time: number = input.runningTime()
        while (true) {
            serial_str += serial.readString()
            if (serial_str.length > 200)
                serial_str = serial_str.substr(serial_str.length - 200)
            if (serial_str.includes("WIFI GOT IP")) {
                result = true
                break
            }
            else if (input.runningTime() - time > 10000) {
                break
            }
        }
        return result
    }
    /**
     * Connect to 
     */
    //% block="Initialize serial connection (Tx of micro:bit) %tx|TX (Rx of micro:bit) %rx|Baud rate %baudrate"
    //% tx.defl=SerialPin.P0
    //% rx.defl=SerialPin.P1
    export function connectWifi(tx: SerialPin, rx: SerialPin, baudrate: BaudRate) {
        wifi_connected = false
        thingsboard_connected = false
        serial.redirect(
            tx,
            rx,
            baudrate
        )
        // Connect to raspberry?
        wifi_connected = waitResponse()
        basic.pause(100)
    }

    // wait for certain response from Raspberry
    function waitTSResponse(): boolean {
        let serial_str: string = ""
        let result: boolean = false
        let time: number = input.runningTime()
        while (true) {
            serial_str += serial.readString()
            if (serial_str.length > 200)
                serial_str = serial_str.substr(serial_str.length - 200)
            if (serial_str.includes("CONNECT")) {
                result = true
                break
            }
            else if (input.runningTime() - time > 10000) {
                break
            }
        }
        return result
    }


    /**
    * Connect to ThingsBoard
    */
    //% block="connect thingsboard"
    //% write_api_key.defl=your_write_api_key
    //% subcategory="ThingsBoard" weight=90
    export function connectThingsBoard() {
        if (wifi_connected) {
            thingsboard_connected = false
            let text = "AT+CIPSTART=\"TCP\",\"demo.thingsboard.io\",80" // ThingsBoard demo server
            sendAT(text, 0) // connect to website server
            thingsboard_connected = waitTSResponse()
            basic.pause(100)
        }
    }

    /**
     * Set data for sending. 
     */
    //% block="set data to send ThingsBoard | Write API key = %write_api_key| Data = %data"
    //% write_api_key.defl=your_write_api_key
    //% data.defl={temperature:}
    //% expandableArgumentMode="enabled"
    //% subcategory="ThingsBoard" weight=85
    export function setData(write_api_key: string, data: string) {
        toSendStr = "POST /api/v1/" + write_api_key + "/telemetry HTTP/1.1\n"
            + "Host: growhouse.it-garden.se\n"
            + "Cache-Control: no-cache\n"
            + "Content-Type: application/json\n"
            + "Content-Length: "+data.length+"\n"
            + "\n"
            + data
    }

    /**
     * upload data. It would not upload anything if it failed to connect to Wifi or ThingsBoard.
     */
    //% block="Upload data to ThingsBoard"
    //% subcategory="ThingsBoard" weight=80
    export function uploadData() {
        if (thingsboard_connected) {
            last_upload_successful = false
            sendAT("AT+CIPSEND=" + (toSendStr.length + 2), 100)
            sendAT(toSendStr, 100) // upload data
            last_upload_successful = waitUPTSResponse()
            basic.pause(100)
        }
    }

    /**
     * Connect to Flask proxy server
     */
    //% block="connect to Flask proxy server | url = %url | port = %port"
    //% url.defl=http://192.168.43.100
    //% port.defl=5000
    //% subcategory="Flask proxy" weight=90
    export function connectToProxy(url: string, port: string) {
        if (wifi_connected) {
            flask_connected = false
            let text = "AT+CIPSTART=\"TCP\",\""+url+"\","+port
            sendAT(text, 0) // connect to website server
            flask_connected = waitTSResponse()
            basic.pause(100)
        }
    }

    /**
     * Set data for sending. 
     */
    //% block="set data to send to Proxy | Write API key = %write_api_key| Data = %data"
    //% write_api_key.defl=your_write_api_key
    //% data.defl={temperature:}
    //% expandableArgumentMode="enabled"
    //% subcategory="ThingsBoard" weight=85
    export function setProxyData(write_api_key: string, data: string) {
        toSendStr = "GET /api/v1/?data={temp: 20}"
        // toSendStr = "POST /api/v1/ HTTP/1.1\n"
        //     + "Host: growhouse.it-garden.se\n"
        //     + "Cache-Control: no-cache\n"
        //     + "Content-Type: application/json\n"
        //     + "Content-Length: "+data.length+"\n"
        //     + "\n"
        //     + write_api_key + "," + data
    }

    /**
     * upload data. It would not upload anything if it failed to connect to Wifi or ThingsBoard.
     */
    //% block="Upload data to Flask Server"
    //% subcategory="Flask proxy" weight=80
    export function uploadDataToProxy() {
        if (flask_connected) {
            last_upload_successful = false
            sendAT("AT+CIPSEND=" + (toSendStr.length + 2), 100)
            sendAT(toSendStr, 100) // upload data
            last_upload_successful = waitUPTSResponse()
            basic.pause(100)
        } else {
            basic.showIcon(IconNames.Ghost)
        }
    }

    function waitUPTSResponse(): boolean {
        let serial_str: string = ""
        let result: boolean = false
        let time: number = input.runningTime()
        while (true) {
            serial_str += serial.readString()
            if (serial_str.length > 200)
                serial_str = serial_str.substr(serial_str.length - 200)
            if (serial_str.includes("SEND OK")) {
                result = true
                break
            }
            else if (input.runningTime() - time > 10000) {
                break
            }
        }
        return result
    }



    /**
    * Wait between uploads
    */
    //% block="Wait %delay ms"
    //% delay.min=0 delay.defl=5000 weight=75
    export function wait(delay: number) {
        if (delay > 0) basic.pause(delay)
    }

    /**
    * Check if ESP8266 successfully connected to Wifi
    */
    //% block="Wifi connected %State" weight=70
    export function wifiState(state: boolean) {
        if (wifi_connected == state) {
            return true
        }
        else {
            return false
        }
    }

    /**
    * Check if ESP8266 successfully connected to ThingsBoard
    */
    //% block="ThingBoard connected %State"
    //% subcategory="ThingsBoard" weight=65
    export function thingsBoardState(state: boolean) {
        if (thingsboard_connected == state) {
            return true
        }
        else {
            return false
        }
    }

    /**
     * Check if ESP8266 successfully connected to Flask Proxy server
     */
    //% block="Flask proxy connected?"
    export function isProxyServerConnected() {
        return flask_connected
    }

    /**
    * Check if ESP8266 successfully uploaded data to ThingsBoard
    */
    //% block="ThingsBoard Last data upload %State"
    //% subcategory="ThingsBoard" weight=60
    export function lastUploadState(state: boolean) {
        if (last_upload_successful == state) {
            return true
        }
        else {
            return false
        }

    }
}
