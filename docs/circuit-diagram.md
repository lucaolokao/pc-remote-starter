# Diagrama do circuito

## Componentes
- ESP32 DevKit
- Relé 10A 250VAC
- Cabos jumper

## Ligações
- `GPIO5` do ESP32 -> `IN` do relé
- `GND` do ESP32 -> `GND` do relé
- `5V` do ESP32 -> `VCC` do relé

## Lado do botão Power do PC
- `COM` e `NO` do relé em paralelo com os pinos do botão Power da placa-mãe.

> O relé fecha contato por 2 segundos, simulando o pressionamento do botão power.
