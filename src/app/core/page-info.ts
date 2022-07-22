import {environment} from '../../environments/environment';

export class PageInfo {

  /** Página atual. */
  public actualPage: number;

  /** Total de páginas. */
  public pages: number;

  /** Total de registros. */
  public count: number;

  /** Tamanho de página. */
  public pageSize: number;

  constructor() {
    this.actualPage = 0;
    this.pages = 0;
    this.count = 0;
    this.pageSize = 10;
  }

  merge(pageInfo: PageInfo): void {
    this.actualPage = pageInfo.actualPage;
    this.pages = pageInfo.pages;
    this.count = pageInfo.count;
    if (pageInfo.pageSize) {
      this.pageSize = pageInfo.pageSize;
    }
    this.keepPageSizeUnderStandard();
  }

  reset(): void {
    this.actualPage = 0;
    this.pages = 0;
    this.count = 0;
    this.keepPageSizeUnderStandard();
  }

  setPageSize(newPageSize: number): void {
    if (this.pageSize !== newPageSize) {
      this.reset();
    }
    this.pageSize = newPageSize;
    this.keepPageSizeUnderStandard();
  }

  private keepPageSizeUnderStandard(): void {
    if (!this.pageSize || this.pageSize < 1) {
      this.pageSize = 10;
    }
  }

}
