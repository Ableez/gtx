import { GiftCard } from "../../../types";
import { giftcards } from "../data/giftcards";

export class Pagination {
  data: GiftCard[];
  pageSize: number;
  currentPage: number;

  constructor(data: GiftCard[], pageSize: number, currentPage: number) {
    this.currentPage = currentPage;
    this.data = data;
    this.pageSize = pageSize;
  }

  getTotalPages() {
    return Math.ceil(this.data.length / this.pageSize);
  }
  getCurrentPageData(): GiftCard[] {
    const begin = (this.currentPage - 1) * this.pageSize;
    const end = begin + this.pageSize;
    return this.data.slice(begin, end);
  }

  goToPage(page: number): void {
    if (page > 0 && page < this.getTotalPages()) this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) this.currentPage++;
  }

  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }
}

// const dataArray: GiftCard[] = Array.from({ length: 300 }, (_, i) => {
//   return i + 1;
// });
// const pagination = new Pagination(dataArray, 10, 1);

// // Display current page data
// // console.log("Page 1:", pagination.getCurrentPageData().length);

// // // Go to next page and display data
// // pagination.nextPage();
// // console.log("Page 2:", pagination.getCurrentPageData());

// // // Go to custom page and display data
// pagination.goToPage(5);
// console.log("Page 5:", pagination.getCurrentPageData());
