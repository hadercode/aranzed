import type { Sale } from "../types";

export function cleanPhoneNumber(raw: string): string {
  if (!raw) return "";
  let digits = raw.replace(/[^0-9]/g, "");
  // Si comienza con 0 (formato local ej. 04141234567), anteponemos el código por defecto de Venezuela 58
  if (digits.startsWith("0")) {
    digits = "58" + digits.slice(1);
  }
  return digits;
}

export function checkIsSaleOverdue(sale: Sale, hasPendingBalance: boolean): boolean {
  if (!sale.dueDate || !hasPendingBalance) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(sale.dueDate);
  due.setHours(0, 0, 0, 0);
  return today.getTime() > due.getTime();
}

export function buildWhatsAppReminderMessage({
  sale,
  companyName,
}: {
  sale: Sale;
  companyName: string;
}) {
  const balanceUSD = Number(
    sale.balance !== undefined
      ? sale.balance
      : sale.total - (sale.paidAmount || 0)
  );
  const balanceVES = Number(
    sale.balanceLocal !== undefined
      ? sale.balanceLocal
      : sale.totalLocal - (sale.paidAmountLocal || 0)
  );

  const formattedUSD = `$${balanceUSD.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedVES =
    balanceVES > 0
      ? `Bs. ${balanceVES.toLocaleString("es-VE", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : null;

  const saleDateFormatted = sale.saleDate
    ? new Date(sale.saleDate).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";

  let dueDateFormatted = "No especificada";
  let antiquityText = "";
  let isOverdue = false;
  let daysOverdue = 0;

  if (sale.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(sale.dueDate);
    due.setHours(0, 0, 0, 0);

    dueDateFormatted = due.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const diffMs = today.getTime() - due.getTime();
    daysOverdue = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (daysOverdue > 0) {
      isOverdue = true;
      antiquityText = `⚠️ *Antigüedad del vencimiento:* Cuenta con *${daysOverdue} día(s)* de retraso tras su fecha de vencimiento.`;
    } else if (daysOverdue === 0) {
      antiquityText = `⏰ *Antigüedad:* El documento vence el día de *hoy*.`;
    } else {
      antiquityText = `📅 *Condición:* Documento dentro del plazo de crédito acordado (vence en *${Math.abs(daysOverdue)} día(s)*).`;
    }
  } else {
    antiquityText = `📋 *Condición:* Documento pendiente de pago emitido el ${saleDateFormatted}.`;
  }

  const message = [
    `Estimado(a) *${sale.customerName.trim()}*,`,
    ``,
    `Esperamos que se encuentre muy bien. Le enviamos un cordial saludo de parte de *${companyName}*.`,
    ``,
    `Nos comunicamos amablemente para compartirle un recordatorio sobre el estado de su cuenta y el saldo pendiente de su compra:`,
    ``,
    `📋 *Detalle del Documento:*`,
    `• *N° Comprobante:* ${sale.saleNumber}`,
    `• *Fecha de Emisión:* ${saleDateFormatted}`,
    `• *Fecha de Vencimiento:* ${dueDateFormatted}`,
    `• *Monto Pendiente:* ${formattedUSD}${formattedVES ? ` / ${formattedVES}` : ""}`,
    `• ${antiquityText}`,
    ``,
    `Agradecemos de antemano su amable atención para la gestión y conciliación de este pago. Si ya realizó la transferencia o cancelación en las últimas horas, por favor haga caso omiso a este mensaje o compártanos el comprobante por este medio.`,
    ``,
    `¡Quedamos a su entera disposición y le deseamos un excelente día!`,
    ``,
    `Atentamente,`,
    `*${companyName}*`,
  ].join("\n");

  return {
    message,
    balanceUSD,
    balanceVES,
    formattedUSD,
    formattedVES,
    dueDateFormatted,
    isOverdue,
    daysOverdue,
    antiquityText,
  };
}

