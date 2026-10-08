# Firmware do FITID

Firmware embarcado do protótipo físico do FITID.

## Hardware atual

- ESP32-S3 N16R8 (16 MB Flash + 8 MB PSRAM)
- RC522 RFID
- Display Hosyond 3,5" 320x480, controlador ST7796U
- Touch capacitivo FT6336U

## Estado atual

A ESP32-S3 já foi validada com sucesso em testes de chip, Flash, PSRAM, Wi-Fi, USB Serial e USB nativa/JTAG. Os headers da placa já foram soldados.

O RC522 será a próxima integração física. O display ainda não foi integrado ao firmware.

A pasta `diagnostics/` contém apenas programas de diagnóstico já usados para validar a placa. O firmware funcional do equipamento será adicionado aqui conforme a integração física avançar.
