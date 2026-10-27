import { ApiProperty } from '@nestjs/swagger';
import { InventoryTransactionResponseDto } from './inventory-transaction-response.dto';

export class PaginatedInventoryTransactionsResponseDto {
  @ApiProperty({
    type: [InventoryTransactionResponseDto],
    description: 'Lista paginada de transacciones',
  })
  data: InventoryTransactionResponseDto[];

  @ApiProperty({ description: 'Total de registros encontrados' })
  total: number;

  @ApiProperty({ description: 'Número de página actual' })
  page: number;

  @ApiProperty({ description: 'Cantidad de elementos por página' })
  limit: number;

  @ApiProperty({ description: 'Total de páginas calculadas' })
  totalPages: number;
}
