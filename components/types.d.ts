import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ImgHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  SVGProps,
  TableHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

/**
 * Detailed Base Properties and Attributes for generic HTML Elements (starting with <div>)
 */
export type ComponentHTMLProps<T = HTMLDivElement> = DetailedHTMLProps<HTMLAttributes<T>, T>;

/**
 * Detailed Base Properties and Attributes for Button HTML Elements (starting with <button>)
 */
export type ComponentButtonProps<T = HTMLButtonElement> = DetailedHTMLProps<ButtonHTMLAttributes<T>, T>;

/**
 * Detailed Base Properties and Attributes for Input HTML Elements (starting with <input>)
 */
export type ComponentInputProps<T = HTMLInputElement> = DetailedHTMLProps<InputHTMLAttributes<T>, T>;

/**
 * Detailed Base Properties and Attributes for the Label HTML Element (starting with <label>)
 */
export type ComponentLabelProps<T = HTMLLabelElement> = DetailedHTMLProps<LabelHTMLAttributes<T>, T>;

/**
 * Detailed Base Properties and Attributes for the Table HTML Element (starting with <table>)
 */
export type ComponentTableProps<T = HTMLTableElement> = DetailedHTMLProps<TableHTMLAttributes<T>, T>;

/**
 * Detailed Base Properties and Attributes for the Textarea HTML Element (starting with <textarea>)
 */
export type ComponentTextareaProps<T = HTMLTextAreaElement> = DetailedHTMLProps<TextareaHTMLAttributes<T>, T>;

/**
 * Detailed Base Properties and Attributes for the Image HTML Element (starting with <img>)
 */
export type ComponentImageProps<T = HTMLImageElement> = DetailedHTMLProps<ImgHTMLAttributes<T>, T>;

/**
 * Detailed Base Properties and Attributes for the SVG HTML Elements (starting with <svg>)
 */
export type ComponentSVGProps = SVGProps<SVGSVGElement>;
