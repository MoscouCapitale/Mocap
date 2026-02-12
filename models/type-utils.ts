import type { Component, ComponentProps, JSX, Ref, VNode } from "preact";
import type { ForwardRefExoticComponent } from "preact/compat";

/**
 * Following 5 type-definitions are based on "https://esm.sh/v132/@radix-ui/react-primitive@1.0.3/X-YS9AdHlwZXMvcmVhY3Q6cHJlYWN0L2NvbXBhdCxyZWFjdDpwcmVhY3QvY29tcGF0/dist/index.d.ts",
 * rewriting `extends ElementType` to `extends JSX.ElementType`
 */
export type PrimitivePropsWithRef<E extends JSX.ElementType> = ComponentPropsWithRef<E> & {
  asChild?: boolean;
};

// deno-lint-ignore no-empty-interface
export interface PrimitiveForwardRefComponent<E extends JSX.ElementType>
  extends React.ForwardRefExoticComponent<PrimitivePropsWithRef<E>> {
}

export type PropsWithRef<P> =
  // Just "P extends { ref?: infer R }" looks sufficient, but R will infer as {} if P is {}.
  "ref" extends keyof P
    ? P extends { ref?: infer R | undefined }
      ? string extends R ? PropsWithoutRef<P> & { ref?: Exclude<R, string> | undefined }
      : P
    : P
    : P;

// deno-lint-ignore no-explicit-any
export type PropsWithoutRef<P> = P extends any ? ("ref" extends keyof P ? Pick<P, Exclude<keyof P, "ref">> : P)
  : P;

export type ComponentPropsWithoutRef<T extends JSX.ElementType> = PropsWithoutRef<ComponentProps<T>>;

/**
 * Based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/27d496583874fdba0902fcefcedc53024efa259c/types/react/index.d.ts#L889,
 * rewriting `extends ElementType` to `extends JSX.ElementType`
 */
export type ComponentPropsWithRef<T extends JSX.ElementType> =
  // deno-lint-ignore no-explicit-any
  T extends (new (props: infer P) => Component<any, any>) ? PropsWithoutRef<P> & RefAttributes<InstanceType<T>>
    : PropsWithRef<ComponentProps<T>>;

type Key = string | number | bigint;
interface Attributes {
  key?: Key | null | undefined;
}
interface RefAttributes<T> extends Attributes {
  ref?: Ref<T> | undefined;
}

/**
 * Based on "https://github.com/DefinitelyTyped/DefinitelyTyped/blob/11fb1265027fe6d75c6897dd07316b0052c13965/types/react/index.d.ts#L119",
 * rewriting `ReactNode` to `VNode`
 */
export type ElementRef<
  C extends // deno-lint-ignore no-explicit-any
  | ForwardRefExoticComponent<any>
  // deno-lint-ignore no-explicit-any
  | { new (props: any): Component<any> }
  // deno-lint-ignore no-explicit-any
  | ((props: any, context?: any) => VNode)
  | keyof JSX.IntrinsicElements,
> = "ref" extends keyof ComponentPropsWithRef<C> ? NonNullable<ComponentPropsWithRef<C>["ref"]> extends Ref<
    infer Instance
  > ? Instance
  : never
  : never;


type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/** Utility type to make some properties of T optional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Utility type to make some properties of T required. */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Utility type to make all properties of T deeply optional. */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;