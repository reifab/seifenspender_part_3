function warte_5_Sekunden_mit_Anzeige () {
    smartfeldAktoren.oledClear()
    for (let fortschritt = 0; fortschritt <= 100; fortschritt++) {
        smartfeldAktoren.oledLoadingBar(fortschritt)
        basic.pause(50)
    }
    smartfeldAktoren.oledClear()
}
let distanzSensorZuSeife = 0
let seifenstandInProzent = 100
let seifenstandAlt = -1
smartfeldAktoren.oledInit(128, 64)
smartfeldAktoren.oledClear()
if (true) {
    smartfeldAktoren.oledWriteStr("Verbinde")
    IoTCube.LoRa_Join(
    eBool.enable,
    eBool.enable,
    10,
    8
    )
    while (!(IoTCube.getStatus(eSTATUS_MASK.JOINED))) {
        smartfeldAktoren.oledWriteStr(".")
        basic.pause(1000)
    }
    smartfeldAktoren.oledClear()
    smartfeldAktoren.oledWriteStr("Verbunden!")
    basic.pause(3000)
    smartfeldAktoren.oledClear()
}
basic.forever(function () {
    smartfeldAktoren.oledClear()
    distanzSensorZuSeife = smartfeldSensoren.measureInCentimetersV2(DigitalPin.P0)
    seifenstandInProzent = (25 - distanzSensorZuSeife) / 25 * 100
    seifenstandInProzent = Math.round(seifenstandInProzent)
    if (seifenstandInProzent < 0) {
        seifenstandInProzent = 0
    }
    smartfeldAktoren.oledWriteNum(seifenstandInProzent)
    smartfeldAktoren.oledWriteStr(" %")
    if (seifenstandAlt != seifenstandInProzent) {
        IoTCube.addUnsignedInteger(eIDs.ID_0, seifenstandInProzent)
        IoTCube.SendBufferSimple()
        warte_5_Sekunden_mit_Anzeige()
        led.plotBarGraph(
        seifenstandInProzent,
        100
        )
        seifenstandAlt = seifenstandInProzent
    }
    basic.pause(100)
})
