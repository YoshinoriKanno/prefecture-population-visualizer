import 'jest-fetch-mock';

declare module 'jest-fetch-mock' {
  interface GlobalWithFetchMock extends NodeJS.Global {
    fetch: GlobalFetch['fetch'] & FetchMock;
  }

  const fetchMock: FetchMock;
  export default fetchMock;
}
