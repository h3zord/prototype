declare module "html2pdf.js" {
  type Html2Pdf = {
    from: (el: HTMLElement | string) => Html2Pdf;
    set: (opt: any) => Html2Pdf;
    save: (filename?: string) => Promise<void>;
    outputPdf: (type?: string, opt?: any) => Promise<Blob>;
    toPdf: () => Html2Pdf;
    output: (type?: string, opt?: any) => Promise<Blob>;
    get: (type: string) => any;
  };

  const html2pdf: (() => Html2Pdf) & Html2Pdf;

  export default html2pdf;
}
