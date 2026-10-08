#include <Arduino.h>
#include <WiFi.h>

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println();
  Serial.println("================================");
  Serial.println("     DIAGNOSTICO FITID ESP32");
  Serial.println("================================");

  Serial.print("Chip: ");
  Serial.println(ESP.getChipModel());
  Serial.print("Revisao: ");
  Serial.println(ESP.getChipRevision());
  Serial.print("Nucleos: ");
  Serial.println(ESP.getChipCores());
  Serial.print("CPU: ");
  Serial.print(ESP.getCpuFreqMHz());
  Serial.println(" MHz");

  Serial.print("Flash: ");
  Serial.print(ESP.getFlashChipSize() / 1024.0 / 1024.0, 2);
  Serial.println(" MB");

  Serial.print("PSRAM detectada: ");
  Serial.println(psramFound() ? "SIM" : "NAO");
  Serial.print("PSRAM total: ");
  Serial.print(ESP.getPsramSize() / 1024.0 / 1024.0, 2);
  Serial.println(" MB");
  Serial.print("PSRAM livre: ");
  Serial.print(ESP.getFreePsram() / 1024.0 / 1024.0, 2);
  Serial.println(" MB");

  Serial.println("Testando Wi-Fi...");
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(500);
  int redes = WiFi.scanNetworks();
  Serial.print("Redes Wi-Fi encontradas: ");
  Serial.println(redes);

  String chipModel = ESP.getChipModel();
  bool compativel = chipModel.indexOf("ESP32-S3") >= 0 &&
                    ESP.getFlashChipSize() >= 15UL * 1024UL * 1024UL &&
                    ESP.getPsramSize() >= 7UL * 1024UL * 1024UL;

  Serial.println("================================");
  Serial.println(compativel ?
    "RESULTADO: PLACA COMPATIVEL COM N16R8" :
    "RESULTADO: VERIFICAR ESPECIFICACOES");
  Serial.println("================================");
}

void loop() {}
