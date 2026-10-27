import { Injectable } from '@nestjs/common';
import { Sale } from '@/sales/domain/entities/sale.entity';
import { SaleType } from '@/sales/domain/enums/sale-type.enum';
import { SaleStatus } from '@/sales/domain/enums/sale-status.enum';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfmake = require('pdfmake');

@Injectable()
export class SalesPdfService {
  constructor() {
    pdfmake.setUrlAccessPolicy(() => false);
    pdfmake.setLocalAccessPolicy(() => true);
    pdfmake.setFonts({
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    });
  }

  private async buildStreamToBuffer(docDefinition: any): Promise<Buffer> {
    const doc = pdfmake.createPdf(docDefinition);
    return await doc.getBuffer();
  }

  async generateSalePdf(
    sale: Sale,
    companyName: string = 'MiniStore',
  ): Promise<Buffer> {
    const isQuotation = sale.saleType === SaleType.QUOTATION;
    const docTitle = isQuotation
      ? 'COTIZACIÓN / PRESUPUESTO'
      : 'COMPROBANTE DE VENTA';

    const itemsRows = sale.items.map((it, idx) => [
      { text: (idx + 1).toString(), alignment: 'center', fontSize: 9 },
      { text: it.description, fontSize: 9 },
      { text: it.quantity.toFixed(2), alignment: 'center', fontSize: 9 },
      { text: `$${it.unitPrice.toFixed(2)}`, alignment: 'right', fontSize: 9 },
      {
        text: `${it.discountRate > 0 ? `${it.discountRate}%` : '-'}`,
        alignment: 'center',
        fontSize: 9,
      },
      {
        text: it.isTaxable ? `${it.taxRate}%` : 'Exento',
        alignment: 'center',
        fontSize: 9,
      },
      {
        text: `$${it.total.toFixed(2)}`,
        alignment: 'right',
        fontSize: 9,
        bold: true,
      },
    ]);

    const docDefinition: any = {
      defaultStyle: { font: 'Helvetica' },
      pageMargins: [40, 40, 40, 40],
      content: [
        // Encabezado
        {
          columns: [
            {
              width: '*',
              stack: [
                {
                  text: companyName.toUpperCase(),
                  fontSize: 16,
                  bold: true,
                  color: '#1e293b',
                },
                {
                  text: 'Sistema de Gestión MiniStore / Nexus ERP',
                  fontSize: 9,
                  color: '#64748b',
                },
              ],
            },
            {
              width: 'auto',
              stack: [
                {
                  text: docTitle,
                  fontSize: 12,
                  bold: true,
                  alignment: 'right',
                  color: isQuotation ? '#0284c7' : '#059669',
                },
                {
                  text: `# ${sale.saleNumber}`,
                  fontSize: 13,
                  bold: true,
                  alignment: 'right',
                  color: '#0f172a',
                },
                {
                  text: `Estado: ${sale.status}`,
                  fontSize: 9,
                  bold: true,
                  alignment: 'right',
                  color:
                    sale.status === SaleStatus.COMPLETED
                      ? '#059669'
                      : '#d97706',
                },
              ],
            },
          ],
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 10,
              x2: 515,
              y2: 10,
              lineWidth: 1,
              lineColor: '#cbd5e1',
            },
          ],
        },
        { text: '', margin: [0, 5] },

        // Datos del Cliente y Emisión
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  text: 'DATOS DEL CLIENTE',
                  fontSize: 9,
                  bold: true,
                  color: '#475569',
                },
                {
                  text: `Cliente: ${sale.customerName}`,
                  fontSize: 9,
                  bold: true,
                },
                {
                  text: `Documento / RIF: ${sale.customerTaxId || 'No especificado'}`,
                  fontSize: 9,
                },
                {
                  text: `Teléfono: ${sale.customerPhone || 'N/A'}`,
                  fontSize: 9,
                },
                { text: `Email: ${sale.customerEmail || 'N/A'}`, fontSize: 9 },
                {
                  text: `Dirección: ${sale.customerAddress || 'N/A'}`,
                  fontSize: 9,
                },
              ],
            },
            {
              width: '50%',
              stack: [
                {
                  text: 'CONDICIONES DE VENTA',
                  fontSize: 9,
                  bold: true,
                  color: '#475569',
                },
                {
                  text: `Fecha de Emisión: ${new Date(sale.saleDate).toLocaleDateString()}`,
                  fontSize: 9,
                },
                ...(isQuotation && sale.validUntil
                  ? [
                      {
                        text: `Válido Hasta: ${new Date(sale.validUntil).toLocaleDateString()}`,
                        fontSize: 9,
                        color: '#b91c1c',
                        bold: true,
                      },
                    ]
                  : []),
                { text: `Método de Pago: ${sale.paymentMethod}`, fontSize: 9 },
                {
                  text: `Tasa de Cambio: 1 USD = ${sale.exchangeRate.toFixed(4)} VES`,
                  fontSize: 9,
                  color: '#0284c7',
                  bold: true,
                },
              ],
            },
          ],
          margin: [0, 5, 0, 15],
        },

        // Tabla de Ítems
        {
          table: {
            headerRows: 1,
            widths: [25, '*', 45, 55, 45, 45, 65],
            body: [
              [
                { text: '#', style: 'tableHeader', alignment: 'center' },
                { text: 'Producto / Descripción', style: 'tableHeader' },
                { text: 'Cant.', style: 'tableHeader', alignment: 'center' },
                { text: 'Precio', style: 'tableHeader', alignment: 'right' },
                { text: 'Desc.', style: 'tableHeader', alignment: 'center' },
                { text: 'IVA', style: 'tableHeader', alignment: 'center' },
                { text: 'Total USD', style: 'tableHeader', alignment: 'right' },
              ],
              ...itemsRows,
            ],
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0
                ? '#f1f5f9'
                : rowIndex % 2 === 0
                  ? '#fafafa'
                  : null,
            hLineColor: () => '#e2e8f0',
            vLineColor: () => '#e2e8f0',
          },
        },

        { text: '', margin: [0, 8] },

        // Totales Bimoneda
        {
          columns: [
            {
              width: '50%',
              stack: [
                ...(sale.notes
                  ? [
                      {
                        text: `Notas / Observaciones: ${sale.notes}`,
                        fontSize: 8,
                        color: '#64748b',
                        italics: true,
                      },
                    ]
                  : []),
                ...(sale.paymentNotes
                  ? [
                      {
                        text: `Detalles de Pago: ${sale.paymentNotes}`,
                        fontSize: 8,
                        color: '#64748b',
                        italics: true,
                      },
                    ]
                  : []),
              ],
            },
            {
              width: '50%',
              table: {
                widths: ['*', 'auto'],
                body: [
                  [
                    { text: 'Subtotal:', fontSize: 9 },
                    {
                      text: `$${sale.subtotal.toFixed(2)}`,
                      alignment: 'right',
                      fontSize: 9,
                    },
                  ],
                  ...(sale.discountAmount > 0
                    ? [
                        [
                          {
                            text: 'Descuento General:',
                            fontSize: 9,
                            color: '#dc2626',
                          },
                          {
                            text: `-$${sale.discountAmount.toFixed(2)}`,
                            alignment: 'right',
                            fontSize: 9,
                            color: '#dc2626',
                          },
                        ],
                      ]
                    : []),
                  [
                    { text: 'IVA Estimado:', fontSize: 9 },
                    {
                      text: `$${sale.taxAmount.toFixed(2)}`,
                      alignment: 'right',
                      fontSize: 9,
                    },
                  ],
                  [
                    { text: 'TOTAL USD:', fontSize: 11, bold: true },
                    {
                      text: `$${sale.total.toFixed(2)}`,
                      alignment: 'right',
                      fontSize: 11,
                      bold: true,
                    },
                  ],
                  [
                    {
                      text: 'TOTAL LOCAL (VES):',
                      fontSize: 11,
                      bold: true,
                      color: '#0369a1',
                    },
                    {
                      text: `Bs. ${sale.totalLocal.toFixed(2)}`,
                      alignment: 'right',
                      fontSize: 11,
                      bold: true,
                      color: '#0369a1',
                    },
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ],
        },

        // Pie de página
        { text: '', margin: [0, 15] },
        {
          text: isQuotation
            ? 'Esta cotización es solo una propuesta informativa y no constituye una factura definitiva ni reserva de stock.'
            : 'Documento mercantil emitido para control administrativo de ventas. ¡Gracias por su preferencia!',
          fontSize: 8,
          color: '#94a3b8',
          alignment: 'center',
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: '#1e293b',
        },
      },
    };

    return this.buildStreamToBuffer(docDefinition);
  }

  async generateSalesListPdf(
    sales: Sale[],
    filtersDesc: string = '',
  ): Promise<Buffer> {
    const rows = sales.map((s, idx) => [
      { text: (idx + 1).toString(), alignment: 'center', fontSize: 8 },
      { text: s.saleNumber, fontSize: 8, bold: true },
      {
        text:
          s.saleType === SaleType.QUOTATION ? 'Cotización' : 'Venta Directa',
        fontSize: 8,
      },
      { text: new Date(s.saleDate).toLocaleDateString(), fontSize: 8 },
      { text: s.customerName, fontSize: 8 },
      {
        text: s.status,
        fontSize: 8,
        bold: true,
        color: s.status === SaleStatus.COMPLETED ? '#059669' : '#d97706',
      },
      {
        text: `$${s.total.toFixed(2)}`,
        alignment: 'right',
        fontSize: 8,
        bold: true,
      },
      {
        text: `Bs. ${s.totalLocal.toFixed(2)}`,
        alignment: 'right',
        fontSize: 8,
      },
    ]);

    const totalUSD = sales.reduce((sum, s) => sum + s.total, 0);
    const totalLocal = sales.reduce((sum, s) => sum + s.totalLocal, 0);

    const docDefinition: any = {
      defaultStyle: { font: 'Helvetica' },
      pageMargins: [30, 30, 30, 30],
      content: [
        {
          columns: [
            {
              text: 'REPORTE GENERAL DE VENTAS Y COTIZACIONES',
              fontSize: 14,
              bold: true,
              color: '#0f172a',
            },
            {
              text: `Generado: ${new Date().toLocaleString()}`,
              alignment: 'right',
              fontSize: 8,
              color: '#64748b',
            },
          ],
        },
        ...(filtersDesc
          ? [
              {
                text: `Filtros: ${filtersDesc}`,
                fontSize: 8,
                color: '#475569',
                margin: [0, 4, 0, 10],
              },
            ]
          : [{ text: '', margin: [0, 5] }]),

        {
          table: {
            headerRows: 1,
            widths: [20, 65, 65, 55, '*', 60, 65, 75],
            body: [
              [
                { text: '#', style: 'tableHeader', alignment: 'center' },
                { text: 'N° Documento', style: 'tableHeader' },
                { text: 'Tipo', style: 'tableHeader' },
                { text: 'Fecha', style: 'tableHeader' },
                { text: 'Cliente', style: 'tableHeader' },
                { text: 'Estado', style: 'tableHeader' },
                { text: 'Total USD', style: 'tableHeader', alignment: 'right' },
                {
                  text: 'Total Local',
                  style: 'tableHeader',
                  alignment: 'right',
                },
              ],
              ...rows,
            ],
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0
                ? '#e2e8f0'
                : rowIndex % 2 === 0
                  ? '#f8fafc'
                  : null,
            hLineColor: () => '#cbd5e1',
            vLineColor: () => '#cbd5e1',
          },
        },

        { text: '', margin: [0, 10] },
        {
          columns: [
            {
              text: `Total Registros: ${sales.length}`,
              fontSize: 9,
              bold: true,
            },
            {
              width: 'auto',
              stack: [
                {
                  text: `TOTAL CONSOLIDADO USD: $${totalUSD.toFixed(2)}`,
                  alignment: 'right',
                  fontSize: 10,
                  bold: true,
                },
                {
                  text: `TOTAL CONSOLIDADO LOCAL: Bs. ${totalLocal.toFixed(2)}`,
                  alignment: 'right',
                  fontSize: 10,
                  bold: true,
                  color: '#0369a1',
                },
              ],
            },
          ],
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: '#0f172a',
        },
      },
    };

    return this.buildStreamToBuffer(docDefinition);
  }
}
