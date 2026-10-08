#include <Arduino.h>
#include "esp_heap_caps.h"

bool verificarPadrao(uint8_t *memoria, size_t tamanho, uint8_t valor) {
  size_t erros = 0;
  for (size_t i = 0; i < tamanho; i++) {
    if (memoria[i] != valor) erros++;
    if ((i & 0xFFFF) == 0) yield();
  }
  return erros == 0;
}

uint8_t gerarPadrao(size_t endereco) {
  return (uint8_t)(((endereco * 31UL) ^ (endereco >> 8) ^ (endereco >> 16) ^ 0xA5) & 0xFF);
}

void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("=======================================");
  Serial.println("     TESTE DE ESTRESSE PSRAM - FITID");
  Serial.println("=======================================");

  if (!psramFound()) {
    Serial.println("ERRO: PSRAM nao detectada.");
    return;
  }

  size_t total = heap_caps_get_total_size(MALLOC_CAP_SPIRAM);
  size_t livre = heap_caps_get_free_size(MALLOC_CAP_SPIRAM);
  size_t maiorBloco = heap_caps_get_largest_free_block(MALLOC_CAP_SPIRAM);
  const size_t margem = 64 * 1024;

  Serial.printf("PSRAM total: %.2f MB\n", total / 1024.0 / 1024.0);
  Serial.printf("PSRAM livre: %.2f MB\n", livre / 1024.0 / 1024.0);
  Serial.printf("Maior bloco disponivel: %.2f MB\n", maiorBloco / 1024.0 / 1024.0);

  if (maiorBloco <= margem) {
    Serial.println("ERRO: bloco de PSRAM muito pequeno.");
    return;
  }

  size_t tamanhoTeste = maiorBloco - margem;
  uint8_t *memoria = (uint8_t *)heap_caps_malloc(tamanhoTeste, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
  if (!memoria) {
    Serial.println("ERRO: nao foi possivel alocar PSRAM.");
    return;
  }

  memset(memoria, 0x00, tamanhoTeste);
  bool teste1 = verificarPadrao(memoria, tamanhoTeste, 0x00);
  memset(memoria, 0xFF, tamanhoTeste);
  bool teste2 = verificarPadrao(memoria, tamanhoTeste, 0xFF);

  for (size_t i = 0; i < tamanhoTeste; i++) {
    memoria[i] = gerarPadrao(i);
    if ((i & 0xFFFF) == 0) yield();
  }

  bool teste3 = true;
  for (size_t i = 0; i < tamanhoTeste; i++) {
    if (memoria[i] != gerarPadrao(i)) {
      teste3 = false;
      break;
    }
    if ((i & 0xFFFF) == 0) yield();
  }

  heap_caps_free(memoria);
  Serial.println(teste1 && teste2 && teste3 ?
    "RESULTADO FINAL: PSRAM APROVADA" :
    "RESULTADO FINAL: FALHA NA PSRAM");
}

void loop() {}
