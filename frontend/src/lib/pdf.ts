// Removidos los imports de nivel superior para evitar errores de SSR
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

export type ContactInfo = {
  companyName: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type PdfOptions = {
  logoUrl?: string;
  contact?: ContactInfo;
  title?: string;
  subtitle?: string;
  fileName?: string;
};

const DEFAULT_OPTIONS: PdfOptions = {
  title: 'Novax Plus',
  fileName: 'novax_document.pdf',
  contact: {
    companyName: 'Novax Plus',
    phone: '(000) 000-0000',
    email: 'contacto@novax.com',
    address: 'Dirección de la empresa',
  },
};

function formatCurrency(value: number) {
  return `Bs. ${value.toFixed(2)}`;
}

function formatDateString(date: string | Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' });
}

async function loadImageAsBase64(url: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(blob);
    });
  } catch {
    return '';
  }
}

// createDocument movido a funciones individuales para soporte de carga dinámica

/**
 * Genera un PDF con la lista de pedidos.
 */
export async function generateOrdersPdf(
  orders: Array<any>,
  opts: PdfOptions = {}
) {
  if (typeof window === 'undefined') return;
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const title = options.title ?? 'Lista de Pedidos';
  const subtitle = options.subtitle ?? 'Listado de pedidos filtrados';

  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const margin = 20; // 2cm
  const pageWidth = doc.internal.pageSize.getWidth();

  const header = async () => {
    if (options.logoUrl) {
      const img = await loadImageAsBase64(options.logoUrl);
      if (img) {
        const imgW = 30;
        const imgH = 30;
        doc.addImage(img, 'PNG', margin, 12, imgW, imgH);
      }
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const printedAt = `Fecha: ${formatDateString(new Date())}`;
    doc.text(printedAt, pageWidth - margin, 18, { align: 'right' });

    if (options.subtitle) {
      doc.setFontSize(10);
      doc.text(options.subtitle, pageWidth / 2, 25, { align: 'center' });
    }
  };

  const footer = (pageNumber: number, totalPages: number) => {
    const y = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const left = `${options.contact?.companyName ?? ''} · ${options.contact?.phone ?? ''} · ${options.contact?.email ?? ''}`.trim();
    const right = `Página ${pageNumber} de ${totalPages}`;
    doc.text(left, margin, y);
    doc.text(right, pageWidth - margin, y, { align: 'right' });
  };

  const body = orders.map((o) => {
    const total = (o.detalles ?? []).reduce((sum: number, d: any) => sum + Number(d.precio) * Number(d.cantidad), 0);
    return [
      `#${o.id}`,
      o.cliente?.nombre ?? '—',
      formatDateString(o.fecha),
      (o.estado || '').toString(),
      formatCurrency(total),
    ];
  });

  const totals = orders.reduce(
    (acc, o) => acc + (o.detalles ?? []).reduce((sum: number, d: any) => sum + Number(d.precio) * Number(d.cantidad), 0),
    0
  );

  autoTable(doc, {
    startY: 32,
    margin: { left: margin, right: margin, top: margin, bottom: margin },
    head: [['N° Pedido', 'Cliente', 'Fecha', 'Estado', 'Total']],
    body,
    styles: {
      font: 'helvetica',
      fontSize: 10,
      textColor: '#000000',
      cellPadding: 4,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: '#f0f4ff',
      textColor: '#0c2461',
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: { fillColor: '#f8f9ff' },
    didDrawPage: (data) => {
      header();
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      const totalPages = doc.getNumberOfPages();
      footer(pageNumber, totalPages);
      // Totales al pie de página
      if (data.pageNumber === doc.getNumberOfPages()) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        const cursorY = data.cursor?.y ?? 0;
        doc.text(`TOTAL GENERAL: ${formatCurrency(totals)}`, doc.internal.pageSize.getWidth() - margin, cursorY + 12, {
          align: 'right',
        });
      }
    },
  });

  doc.save(options.fileName ?? 'novax_pedidos.pdf');
}

/**
 * Genera un PDF con el detalle de un pedido específico.
 */
export async function generateOrderDetailPdf(order: any, opts: PdfOptions = {}) {
  if (typeof window === 'undefined') return;
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const title = options.title ?? 'Detalle de Pedido';

  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const margin = 20; // 2cm
  const pageWidth = doc.internal.pageSize.getWidth();

  const header = async () => {
    if (options.logoUrl) {
      const img = await loadImageAsBase64(options.logoUrl);
      if (img) {
        const imgW = 30;
        const imgH = 30;
        doc.addImage(img, 'PNG', margin, 12, imgW, imgH);
      }
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const printedAt = `Fecha: ${formatDateString(new Date())}`;
    doc.text(printedAt, pageWidth - margin, 18, { align: 'right' });

    if (options.subtitle) {
      doc.setFontSize(10);
      doc.text(options.subtitle, pageWidth / 2, 25, { align: 'center' });
    }
  };

  const footer = (pageNumber: number, totalPages: number) => {
    const y = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const left = `${options.contact?.companyName ?? ''} · ${options.contact?.phone ?? ''} · ${options.contact?.email ?? ''}`.trim();
    const right = `Página ${pageNumber} de ${totalPages}`;
    doc.text(left, margin, y);
    doc.text(right, pageWidth - margin, y, { align: 'right' });
  };

  const orderInfoY = 32;
  const leftX = margin;
  const rightX = doc.internal.pageSize.getWidth() / 2 + 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`N° Pedido: #${order.id}`, leftX, orderInfoY + 8);
  doc.text(`Fecha: ${formatDateString(order.fecha)}`, leftX, orderInfoY + 15);
  doc.text(`Estado: ${order.estado}`, leftX, orderInfoY + 22);

  doc.text('Cliente:', rightX, orderInfoY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(order.cliente?.nombre ?? '—', rightX, orderInfoY + 15);
  doc.text(order.cliente?.telefono ?? '—', rightX, orderInfoY + 22);
  doc.text(order.cliente?.correo ?? '—', rightX, orderInfoY + 29);
  doc.text(order.cliente?.direccion ?? '—', rightX, orderInfoY + 36);

  const items = (order.detalles ?? []).map((d: any, idx: number) => [
    (idx + 1).toString(),
    d.producto?.nombre ?? '—',
    d.cantidad?.toString() ?? '0',
    formatCurrency(Number(d.precio) ?? 0),
    formatCurrency(Number(d.precio) * Number(d.cantidad)),
  ]);

  autoTable(doc, {
    startY: orderInfoY + 46,
    margin: { left: margin, right: margin, bottom: margin },
    head: [['#', 'Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
    body: items,
    styles: {
      font: 'helvetica',
      fontSize: 10,
      textColor: '#000000',
      cellPadding: 4,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: '#f0f4ff',
      textColor: '#0c2461',
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: { fillColor: '#f8f9ff' },
    didDrawPage: (data) => {
      header();
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      const totalPages = doc.getNumberOfPages();
      footer(pageNumber, totalPages);
    },
  });

  const subtotal = (order.detalles ?? []).reduce((sum: number, d: any) => sum + Number(d.precio) * Number(d.cantidad), 0);
  const impuestos = order.impuestos ?? 0;
  const descuentos = order.descuentos ?? 0;
  const total = subtotal + impuestos - descuentos;

  const lastAutoTable = (doc as any).lastAutoTable;
  const summaryY = lastAutoTable ? lastAutoTable.finalY + 10 : 0;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Subtotal:', doc.internal.pageSize.getWidth() - margin - 50, summaryY);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(subtotal), doc.internal.pageSize.getWidth() - margin, summaryY, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Impuestos:', doc.internal.pageSize.getWidth() - margin - 50, summaryY + 6);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(impuestos), doc.internal.pageSize.getWidth() - margin, summaryY + 6, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.text('Descuentos:', doc.internal.pageSize.getWidth() - margin - 50, summaryY + 12);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(descuentos), doc.internal.pageSize.getWidth() - margin, summaryY + 12, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', doc.internal.pageSize.getWidth() - margin - 50, summaryY + 20);
  doc.text(formatCurrency(total), doc.internal.pageSize.getWidth() - margin, summaryY + 20, { align: 'right' });

  // Observaciones
  if (order.observaciones) {
    const y = summaryY + 32;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(order.observaciones, margin, y + 5, { maxWidth: doc.internal.pageSize.getWidth() - margin * 2 });
  }

  doc.save(options.fileName ?? `novax_detalle_${order.id}.pdf`);
}

/**
 * Genera un PDF con la lista de clientes.
 */
export async function generateClientsPdf(
  clients: Array<any>,
  opts: PdfOptions = {}
) {
  if (typeof window === 'undefined') return;
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const title = options.title ?? 'Lista de Clientes';
  const subtitle = options.subtitle ?? 'Listado de clientes filtrados';

  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const margin = 20; // 2cm
  const pageWidth = doc.internal.pageSize.getWidth();

  const header = async () => {
    if (options.logoUrl) {
      const img = await loadImageAsBase64(options.logoUrl);
      if (img) {
        const imgW = 30;
        const imgH = 30;
        doc.addImage(img, 'PNG', margin, 12, imgW, imgH);
      }
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const printedAt = `Fecha: ${formatDateString(new Date())}`;
    doc.text(printedAt, pageWidth - margin, 18, { align: 'right' });

    if (options.subtitle) {
      doc.setFontSize(10);
      doc.text(options.subtitle, pageWidth / 2, 25, { align: 'center' });
    }
  };

  const footer = (pageNumber: number, totalPages: number) => {
    const y = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const left = `${options.contact?.companyName ?? ''} · ${options.contact?.phone ?? ''} · ${options.contact?.email ?? ''}`.trim();
    const right = `Página ${pageNumber} de ${totalPages}`;
    doc.text(left, margin, y);
    doc.text(right, pageWidth - margin, y, { align: 'right' });
  };

  const body = clients.map((c) => [
    c.nombre ?? '—',
    c.provincia?.nombre ?? '—',
    c.zona?.nombre ?? '—',
    c.telefono ?? '—',
    c.correo ?? '—',
  ]);

  autoTable(doc, {
    startY: 32,
    margin: { left: margin, right: margin, top: margin, bottom: margin },
    head: [['Nombre', 'Provincia', 'Zona', 'Teléfono', 'Correo']],
    body,
    styles: {
      font: 'helvetica',
      fontSize: 10,
      textColor: '#000000',
      cellPadding: 4,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: '#f0f4ff',
      textColor: '#0c2461',
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: { fillColor: '#f8f9ff' },
    didDrawPage: (data) => {
      header();
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      const totalPages = doc.getNumberOfPages();
      footer(pageNumber, totalPages);
    },
  });

  doc.save(options.fileName ?? 'novax_clientes.pdf');
}

/**
 * Genera un PDF con el detalle de un cliente específico.
 */
export async function generateClientDetailPdf(client: any, opts: PdfOptions = {}) {
  if (typeof window === 'undefined') return;
  const { jsPDF } = await import('jspdf');
  // const autoTable = (await import('jspdf-autotable')).default;

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const title = options.title ?? 'Detalle de Cliente';

  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const margin = 20; // 2cm
  const pageWidth = doc.internal.pageSize.getWidth();

  const header = async () => {
    if (options.logoUrl) {
      const img = await loadImageAsBase64(options.logoUrl);
      if (img) {
        const imgW = 30;
        const imgH = 30;
        doc.addImage(img, 'PNG', margin, 12, imgW, imgH);
      }
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const printedAt = `Fecha: ${formatDateString(new Date())}`;
    doc.text(printedAt, pageWidth - margin, 18, { align: 'right' });

    if (options.subtitle) {
      doc.setFontSize(10);
      doc.text(options.subtitle, pageWidth / 2, 25, { align: 'center' });
    }
  };

  const footer = (pageNumber: number, totalPages: number) => {
    const y = doc.internal.pageSize.getHeight() - 12;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const left = `${options.contact?.companyName ?? ''} · ${options.contact?.phone ?? ''} · ${options.contact?.email ?? ''}`.trim();
    const right = `Página ${pageNumber} de ${totalPages}`;
    doc.text(left, margin, y);
    doc.text(right, pageWidth - margin, y, { align: 'right' });
  };

  // Llamar header al inicio
  await header();

  const clientInfoY = 32;
  const leftX = margin;
  const rightX = doc.internal.pageSize.getWidth() / 2 + 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Nombre: ${client.nombre ?? '—'}`, leftX, clientInfoY + 8);
  doc.text(`CI: ${client.ci ?? '—'}`, leftX, clientInfoY + 15);
  doc.text(`Correo: ${client.correo ?? '—'}`, leftX, clientInfoY + 22);

  doc.text('Teléfono:', rightX, clientInfoY + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(client.telefono ?? '—', rightX, clientInfoY + 15);
  doc.text('Dirección:', rightX, clientInfoY + 22);
  doc.text(client.direccion ?? '—', rightX, clientInfoY + 29);
  doc.text('Provincia:', rightX, clientInfoY + 36);
  doc.text(client.provincia?.nombre ?? '—', rightX, clientInfoY + 43);
  doc.text('Zona:', rightX, clientInfoY + 50);
  doc.text(client.zona?.nombre ?? '—', rightX, clientInfoY + 57);

  if (client.latitud && client.longitud) {
    doc.setFont('helvetica', 'bold');
    doc.text('Coordenadas:', leftX, clientInfoY + 36);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lat: ${client.latitud}, Lng: ${client.longitud}`, leftX, clientInfoY + 43);
  }

  // Observaciones si existen
  if (client.observaciones) {
    const y = clientInfoY + 70;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Observaciones:', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(client.observaciones, margin, y + 5, { maxWidth: doc.internal.pageSize.getWidth() - margin * 2 });
  }

  // Llamar footer al final
  const pageNumber = doc.getCurrentPageInfo().pageNumber;
  const totalPages = doc.getNumberOfPages();
  footer(pageNumber, totalPages);

  doc.save(options.fileName ?? `novax_detalle_cliente_${client.id}.pdf`);
}

export async function generateCategoriasPdf(
  categorias: Array<any>,
  opts: PdfOptions = {}
) {
  if (typeof window === "undefined") return;
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const title = options.title ?? "Lista de Categorías";
  const subtitle = options.subtitle ?? "Listado de categorías filtradas";

  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  const header = async () => {
    if (options.logoUrl) {
      const img = await loadImageAsBase64(options.logoUrl);
      if (img) doc.addImage(img, "PNG", margin, 12, 30, 30);
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, 18, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Fecha: ${formatDateString(new Date())}`, pageWidth - margin, 18, { align: "right" });
    if (options.subtitle) {
      doc.setFontSize(10);
      doc.text(options.subtitle, pageWidth / 2, 25, { align: "center" });
    }
  };

  const body = categorias.map((c) => [
    `#${c.id}`,
    c.nombre ?? "—",
    c.descripcion ?? "—",
    c.createdAt ? formatDateString(c.createdAt) : "—",
  ]);

autoTable(doc, {
  startY: 32,
  margin: { left: margin, right: margin, top: margin, bottom: margin },
  head: [["ID", "Nombre", "Descripción", "Fecha de creación"]],
  body,
  styles: { font: "helvetica", fontSize: 10, textColor: "#000", cellPadding: 4 },
  headStyles: { fillColor: "#f0f4ff", textColor: "#0c2461", fontStyle: "bold", halign: "center" },
  alternateRowStyles: { fillColor: "#f8f9ff" },
  didDrawPage: (data) => {
    header(); // asegúrate que header sea síncrono
  },
});


  doc.save(options.fileName ?? "novax_categorias.pdf");
}

export async function generateCategoriaDetailPdf(categoria: any, opts: PdfOptions = {}) {
  if (typeof window === "undefined") return;
  const { jsPDF } = await import("jspdf");

  const options = { ...DEFAULT_OPTIONS, ...opts };
  const title = options.title ?? "Detalle de Categoría";

  const doc = new jsPDF({ unit: "mm", format: "letter" });
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();

  const header = async () => {
    if (options.logoUrl) {
      const img = await loadImageAsBase64(options.logoUrl);
      if (img) doc.addImage(img, "PNG", margin, 12, 30, 30);
    }
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, pageWidth / 2, 18, { align: "center" });
    doc.setFontSize(9);
    doc.text(`Fecha: ${formatDateString(new Date())}`, pageWidth - margin, 18, { align: "right" });
    if (options.subtitle) {
      doc.setFontSize(10);
      doc.text(options.subtitle, pageWidth / 2, 25, { align: "center" });
    }
  };

  await header();

  const infoY = 32;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`ID: #${categoria.id}`, margin, infoY + 8);
  doc.text(`Nombre: ${categoria.nombre ?? "—"}`, margin, infoY + 15);
  doc.text(`Descripción: ${categoria.descripcion ?? "—"}`, margin, infoY + 22);
  doc.text(`Fecha de creación: ${categoria.createdAt ? formatDateString(categoria.createdAt) : "—"}`, margin, infoY + 29);

  doc.save(options.fileName ?? `novax_categoria_${categoria.id}.pdf`);
}