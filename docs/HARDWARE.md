# Hardware do FITID

## ESP32-S3

Placa atual: ESP32-S3 N16R8, revisão física YD-ESP32-23 / 2022-V1.3.

Validações realizadas:

- ESP32-S3 detectado corretamente
- 2 núcleos / 240 MHz
- 16 MB de Flash
- 8 MB de PSRAM
- teste de estresse de aproximadamente 7,81 MB da PSRAM aprovado
- Wi-Fi detectando redes
- USB Serial aprovada
- USB nativa/JTAG aprovada
- upload realizado pelas duas interfaces USB
- headers soldados

## RFID

RC522 já disponível e com header soldado. Biblioteca escolhida no Arduino IDE: `MFRC522 by GithubCommunity` 1.4.12.

Integração física e leitura de UID são o próximo passo.

## Display

Display comprado: Hosyond 3,5" 320x480, ST7796U por SPI, touch capacitivo FT6336U por I2C.

O slot microSD integrado não será considerado requisito principal devido a relatos de instabilidade/competição no barramento. A primeira estratégia será armazenar recursos gráficos na Flash do ESP32-S3; microSD externo poderá ser avaliado futuramente se necessário.

## Pinagem

A pinagem definitiva do conjunto ESP32 + RC522 + display será fechada somente após os testes físicos. Evitar GPIOs envolvidos com memória Octal e preservar as linhas necessárias à USB nativa quando possível.
