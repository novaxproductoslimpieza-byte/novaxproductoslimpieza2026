import { ContactInfo } from './pdf';

function formatDateString(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(2)}`;
}

function buildPrintStyles() {
  return `
    @page { size: letter; margin: 2cm; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12pt;
      color: #000;
      margin: 0;
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      padding: 0;
    }

    .print-container {
      width: 100%;
      padding: 0;
      margin: 0;
    }

    .print-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      border-bottom: 1px solid #d1d5db;
      padding-bottom: 10px;
    }

    .print-logo {
      height: 120px;
      width: auto;
      object-fit: contain;
    }

    .print-title {
      text-align: center;
      flex: 1;
      font-size: 16pt;
      font-weight: 700;
      color: #0b3b90;
    }

    .print-subtitle {
      font-size: 10pt;
      color: #475569;
      margin-top: 4px;
    }

    .print-meta {
      text-align: right;
      font-size: 9pt;
      color: #475569;
      line-height: 1.3;
    }

    .print-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      margin-bottom: 14px;
    }

    .print-table th,
    .print-table td {
      border: 1px solid #cbd5e1;
      padding: 6px 8px;
      font-size: 10pt;
      vertical-align: top;
    }

    .print-table th {
      background: #eff6ff;
      color: #0b3b90;
      font-weight: 700;
      text-align: left;
    }

    .print-table tbody tr:nth-child(odd) {
      background: #f8fafc;
    }

    .print-footer {
      border-top: 1px solid #d1d5db;
      padding-top: 10px;
      font-size: 9pt;
      color: #475569;
      display: flex;
      justify-content: space-between;
    }

    .print-footer .footer-left {
      max-width: 60%;
    }

    .print-footer .footer-right {
      text-align: right;
    }

    .page-number:after {
      content: "Página " counter(page) " de " counter(pages);
    }

    @media print {
      body { color: #000; }
    }
  `;
}

function buildHeaderHTML(
  title: string,
  subtitle: string | undefined,
  logoUrl?: string,
  contact?: ContactInfo
) {
  const printedAt = formatDateString(new Date());
  return `
    <div class="print-header">
      <div style="display:flex; align-items:center; gap:12px;">
        ${logoUrl ? `<img class="print-logo" src="${logoUrl}" alt="Logo"/>` : ''}
        <div style="display:flex; flex-direction:column;">
          <div class="print-title">${title}</div>
          ${subtitle ? `<div class="print-subtitle">${subtitle}</div>` : ''}
        </div>
      </div>
      <div class="print-meta">
        <div>Fecha: ${printedAt}</div>
        ${contact ? `<div>${contact.companyName}</div>` : ''}
      </div>
    </div>
  `;
}

function buildFooterHTML(contact?: ContactInfo) {
  const contactText = contact
    ? `${contact.companyName} · ${contact.phone ?? ''} · ${contact.email ?? ''}`
    : '';

  const addressText = contact?.address ?? '';

  return `
    <div class="print-footer">
      <div class="footer-left">
        ${contactText ? `<div>${contactText}</div>` : ''}
        ${addressText ? `<div>Dirección: ${addressText}</div>` : ''}
      </div>
      <div class="footer-right page-number"></div>
    </div>
  `;
}

function openPrintWindow(html: string) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  const cleanup = () => {
    try {
      printWindow.close();
    } catch {
      // ignore
    }
  };

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Imprimir</title>
        <style>${buildPrintStyles()}</style>
      </head>
      <body>
        <div class="print-container">
          ${html}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();

  // Cerrar automáticamente después de imprimir (o cancelar).
  printWindow.onafterprint = cleanup;
  printWindow.addEventListener('beforeunload', cleanup);
  setTimeout(() => {
    if (!printWindow.closed) {
      // En algunos navegadores onafterprint puede no dispararse.
      cleanup();
    }
  }, 2000);

  printWindow.onload = () => {
    printWindow.print();
  };
}

export function printOrdersList(
  orders: Array<any>,
  opts: { logoUrl?: string; contact?: ContactInfo; title?: string; subtitle?: string } = {}
) {
  const title = opts.title ?? 'Lista de Pedidos';
  const subtitle = opts.subtitle ?? 'Pedidos filtrados';

  const header = buildHeaderHTML(title, subtitle, opts.logoUrl, opts.contact);

  const rows = orders
    .map((o) => {
      const total = (o.detalles ?? []).reduce((sum: number, d: any) => sum + Number(d.precio) * Number(d.cantidad), 0);
      return `
        <tr>
          <td>#${o.id}</td>
          <td>${o.cliente?.nombre ?? '—'}</td>
          <td>${formatDateString(o.fecha)}</td>
          <td>${o.estado ?? '—'}</td>
          <td>${formatCurrency(total)}</td>
        </tr>
      `;
    })
    .join('');

  const totalGeneral = orders.reduce(
    (acc, o) => acc + (o.detalles ?? []).reduce((sum: number, d: any) => sum + Number(d.precio) * Number(d.cantidad), 0),
    0
  );

  const table = `
    <table class="print-table">
      <thead>
        <tr>
          <th>N° Pedido</th>
          <th>Cliente</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="text-align:right;font-weight:700;">TOTAL GENERAL:</td>
          <td style="font-weight:700;">${formatCurrency(totalGeneral)}</td>
        </tr>
      </tfoot>
    </table>
  `;

  const footer = buildFooterHTML(opts.contact);

  openPrintWindow(`${header}${table}${footer}`);
}

export function printOrderDetail(
  order: any,
  opts: { logoUrl?: string; contact?: ContactInfo; title?: string; subtitle?: string } = {}
) {
  const title = opts.title ?? 'Detalle de Pedido';
  const subtitle = opts.subtitle ?? `Pedido #${order.id}`;

  const header = buildHeaderHTML(title, subtitle, opts.logoUrl, opts.contact);

  const total = (order.detalles ?? []).reduce((sum: number, d: any) => sum + Number(d.precio) * Number(d.cantidad), 0);
  const impuestos = order.impuestos ?? 0;
  const descuentos = order.descuentos ?? 0;
  const finalTotal = total + impuestos - descuentos;

  const clienteHtml = `
    <div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px;">
      <div style="flex:1; min-width:240px;">
        <div style="font-weight:700; margin-bottom:4px;">Cliente</div>
        <div>${order.cliente?.nombre ?? '—'}</div>
        <div>${order.cliente?.telefono ?? '—'}</div>
        <div>${order.cliente?.correo ?? '—'}</div>
      </div>
      <div style="flex:1; min-width:240px;">
        <div style="font-weight:700; margin-bottom:4px;">Pedido</div>
        <div>N° Pedido: #${order.id}</div>
        <div>Fecha: ${formatDateString(order.fecha)}</div>
        <div>Estado: ${order.estado ?? '—'}</div>
      </div>
    </div>
  `;

  const items = (order.detalles ?? [])
    .map((d: any, idx: number) => {
      const subtotal = Number(d.precio) * Number(d.cantidad);
      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${d.producto?.nombre ?? '—'}</td>
          <td style="text-align:center;">${d.cantidad}</td>
          <td style="text-align:right;">${formatCurrency(Number(d.precio) ?? 0)}</td>
          <td style="text-align:right;">${formatCurrency(subtotal)}</td>
        </tr>
      `;
    })
    .join('');

  const table = `
    <table class="print-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio Unit.</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${items}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" style="text-align:right; font-weight:700;">Subtotal:</td>
          <td style="text-align:right;">${formatCurrency(total)}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align:right; font-weight:700;">Impuestos:</td>
          <td style="text-align:right;">${formatCurrency(impuestos)}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align:right; font-weight:700;">Descuentos:</td>
          <td style="text-align:right;">${formatCurrency(descuentos)}</td>
        </tr>
        <tr>
          <td colspan="4" style="text-align:right; font-weight:700; font-size:11pt;">Total:</td>
          <td style="text-align:right; font-weight:700; font-size:11pt;">${formatCurrency(finalTotal)}</td>
        </tr>
      </tfoot>
    </table>
  `;

  const observations = order.observaciones ? `
    <div style="margin-top:12px;">
      <div style="font-weight:700; margin-bottom:4px;">Observaciones</div>
      <div>${order.observaciones}</div>
    </div>
  ` : '';

  const footer = buildFooterHTML(opts.contact);

  openPrintWindow(`${header}${clienteHtml}${table}${observations}${footer}`);
}

export function printClientsList(
  clients: Array<any>,
  opts: { logoUrl?: string; contact?: ContactInfo; title?: string; subtitle?: string } = {}
) {
  const title = opts.title ?? 'Lista de Clientes';
  const subtitle = opts.subtitle ?? 'Clientes filtrados';

  const header = buildHeaderHTML(title, subtitle, opts.logoUrl, opts.contact);

  const rows = clients
    .map((c) => `
      <tr>
        <td>${c.nombre ?? '—'}</td>
        <td>${c.provincia?.nombre ?? '—'}</td>
        <td>${c.zona?.nombre ?? '—'}</td>
        <td>${c.telefono ?? '—'}</td>
        <td>${c.correo ?? '—'}</td>
      </tr>
    `)
    .join('');

  const table = `
    <table class="print-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Provincia</th>
          <th>Zona</th>
          <th>Teléfono</th>
          <th>Correo</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  const footer = buildFooterHTML(opts.contact);

  openPrintWindow(`${header}${table}${footer}`);
}

export function printClientDetail(
  client: any,
  opts: { logoUrl?: string; contact?: ContactInfo; title?: string; subtitle?: string } = {}
) {
  const title = opts.title ?? 'Detalle de Cliente';
  const subtitle = opts.subtitle ?? `Cliente: ${client.nombre ?? '—'}`;

  const header = buildHeaderHTML(title, subtitle, opts.logoUrl, opts.contact);

  const clienteHtml = `
    <div style="margin-top:12px; display:flex; flex-wrap:wrap; gap:8px;">
      <div style="flex:1; min-width:240px;">
        <div style="font-weight:700; margin-bottom:4px;">Información Personal</div>
        <div>Nombre: ${client.nombre ?? '—'}</div>
        <div>CI: ${client.ci ?? '—'}</div>
        <div>Correo: ${client.correo ?? '—'}</div>
        <div>Teléfono: ${client.telefono ?? '—'}</div>
      </div>
      <div style="flex:1; min-width:240px;">
        <div style="font-weight:700; margin-bottom:4px;">Ubicación</div>
        <div>Dirección: ${client.direccion ?? '—'}</div>
        <div>Provincia: ${client.provincia?.nombre ?? '—'}</div>
        <div>Zona: ${client.zona?.nombre ?? '—'}</div>
        ${client.latitud && client.longitud ? `<div>Coordenadas: ${client.latitud}, ${client.longitud}</div>` : ''}
      </div>
    </div>
  `;

  const observations = client.observaciones ? `
    <div style="margin-top:12px;">
      <div style="font-weight:700; margin-bottom:4px;">Observaciones</div>
      <div>${client.observaciones}</div>
    </div>
  ` : '';

  const footer = buildFooterHTML(opts.contact);

  openPrintWindow(`${header}${clienteHtml}${observations}${footer}`);
}

export function printCategoriasList(
  categorias: Array<any>,
  opts: { logoUrl?: string; title?: string; subtitle?: string } = {}
) {
  const title = opts.title ?? "Lista de Categorías";
  const subtitle = opts.subtitle ?? "Categorías filtradas";

  const header = buildHeaderHTML(title, subtitle, opts.logoUrl);

  const rows = categorias
    .map(
      (c) => `
      <tr>
        <td>#${c.id}</td>
        <td>${c.nombre ?? "—"}</td>
        <td>${c.descripcion ?? "—"}</td>
        <td>${c.createdAt ? formatDateString(c.createdAt) : "—"}</td>
      </tr>
    `
    )
    .join("");

  const table = `
    <table class="print-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha de creación</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  const footer = buildFooterHTML();

  openPrintWindow(`${header}${table}${footer}`);
}

export function printCategoriaDetail(
  categoria: any,
  opts: { logoUrl?: string; title?: string; subtitle?: string } = {}
) {
  const title = opts.title ?? "Detalle de Categoría";
  const subtitle = opts.subtitle ?? `Categoría #${categoria.id}`;

  const header = buildHeaderHTML(title, subtitle, opts.logoUrl);

  const detalleHtml = `
    <div style="margin-top:12px;">
      <div style="font-weight:700; margin-bottom:4px;">Información de la Categoría</div>
      <div><strong>Nombre:</strong> ${categoria.nombre ?? "—"}</div>
      <div><strong>Descripción:</strong> ${categoria.descripcion ?? "—"}</div>
      <div><strong>Fecha de creación:</strong> ${categoria.createdAt ? formatDateString(categoria.createdAt) : "—"
    }</div>
    </div>
  `;

  const footer = buildFooterHTML();

  openPrintWindow(`${header}${detalleHtml}${footer}`);
}