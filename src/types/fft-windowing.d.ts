declare module 'fft-windowing' {
  function hann<T extends number[] | Float32Array>(values: T): T;
  function hamming<T extends number[] | Float32Array>(values: T): T;
  function cosine<T extends number[] | Float32Array>(values: T): T;
  function lanczos<T extends number[] | Float32Array>(values: T): T;
  function exact_blackman<T extends number[] | Float32Array>(values: T): T;
  function nuttall<T extends number[] | Float32Array>(values: T): T;
  function blackman_harris<T extends number[] | Float32Array>(values: T): T;
  function blackman_nuttall<T extends number[] | Float32Array>(values: T): T;
  function flat_top<T extends number[] | Float32Array>(values: T): T;
}
