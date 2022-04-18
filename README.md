
# CONTROL TPV REDSYS

```console
npm run start
```


0,01 -> 02 31 30 30 31 90 31    90 90 90 90 90 90 90 90 90 90 90 03 32 
0,02 -> 02 31 30 30 31 90 32    90 90 90 90 90 90 90 90 90 90 90 03 31 
0,03 -> 02 31 30 30 31 90 33    90 90 90 90 90 90 90 90 90 90 90 03 30 
0,04 -> 02 31 30 30 31 90 34    90 90 90 90 90 90 90 90 90 90 90 03 37 
0,05 -> 02 31 30 30 31 90 35    90 90 90 90 90 90 90 90 90 90 90 03 36 
0,06 -> 02 31 30 30 31 90 36    90 90 90 90 90 90 90 90 90 90 90 03 35 
0,07 -> 02 31 30 30 31 90 37    90 90 90 90 90 90 90 90 90 90 90 03 34 
0,08 -> 02 31 30 30 31 90 38    90 90 90 90 90 90 90 90 90 90 90 03 3B 
0,09 -> 02 31 30 30 31 90 39    90 90 90 90 90 90 90 90 90 90 90 03 3A 
0,10 -> 02 31 30 30 31 90 31 30 90 90 90 90 90 90 90 90 90 90 90 03 02 
0,11 -> 02 31 30 30 31 90 31 31 90 90 90 90 90 90 90 90 90 90 90 03 03









## Peticion Venta (TicketPoint -> TPV)
 
- Trama sniffeada: 02 31 30 30 31 90 35 90 90 90 90 90 90 90 90 90 90 90 03 36
- PAG 87

02 STX
(3)1 Entrada de datos 
(3)0 Petición
(3)0 Petición
(3)1 Genera Boleta
-> Aqui faltaría el indicador de modo de trabajo: (3)0
90 Separador
(3)5 CANTIDAD A COBRAR
90 Separador
90 Separador
90 Separador
90 Separador
90 Separador
90 Separador
90 Separador
90 Separador
90 Separador
90 Separador
90 Separador
03 ETX
(3)6 LRC (ACK)
 
## Confirmación Venta (Ticketpoint -> TPV)

- Trama sniffeada: 02 39 38 37 33 90 90 30 03 36
- PAG 134

02 STX
(3)9 Entrada de datos
(3)8 Tipo de transaccion
(3)7 Tipo de transaccion
(3)3 Impresion de boletas
(3)0 Indicador modo de trabajo
90 Separador
90 Separador
(3)0 Producto dispensado correctamente
03 ETX
(3)6 LRC (ACK)

## Confirmación lectura de tarjeta (TPV -> Ticketpoint)

- Trama Sniffeada: 02 39 38 36 33 90 90 03 07
- PAG 136

02 STX
(3)9 Entrada de datos
(3)8 Tipo de transaccion
(3)6 Tipo de transaccion
(3)3 Impresión de boletas
-> Aqui faltaría el indicador de modo de trabajo: (3)0
90 Separador
90 Separador
-> Aquí faltaría otro separador ¿?
03 ETX
07 LRC (¿?)


