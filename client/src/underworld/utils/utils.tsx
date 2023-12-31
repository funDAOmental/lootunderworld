import { shortString } from "starknet";
import { Entity } from '@dojoengine/recs'

export const bigintToHex = (n: bigint) => `0x${n.toString(16)}`
export const bigintToEntity = (n: bigint): Entity => (`0x${n.toString(16)}` as Entity)
export const numberToHex = (num: number): string => `0x${num.toString(16)}`
export const strToFelt252 = (str: string): string => shortString.encodeShortString(str)

export const abs = (v: number): number => (v < 0 ? -v : v)
export const min = (v1: number, v2: number): number => (v1 < v2 ? v1 : v2)
export const max = (v1: number, v2: number): number => (v1 > v2 ? v1 : v2)
export const sign = (v: number): number => (v > 0 ? 1 : v < 0 ? -1 : 0)
export const clamp = (v: number, min: number, max: number): number => (v < min ? min : v > max ? max : v)
export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)
export const lerp = (min: number, max: number, f: number): number => (min + (max - min) * f)
export const map = (v: number, inMin: number, inMax: number, outMin: number, outMax: number) => (outMin + (outMax - outMin) * ((v - inMin) / (inMax - inMin)))
export const modf = (v: number, m: number): number => (v - m * Math.floor(v / m))
export const fmod = (a: number, b: number): number => Number((a - (Math.floor(a / b) * b)).toPrecision(8)) // TODO: TEST THIS!!!
