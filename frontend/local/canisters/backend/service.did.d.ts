import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Backend {
  'add' : ActorMethod<[bigint], undefined>,
  'get' : ActorMethod<[], bigint>,
  'inc' : ActorMethod<[], undefined>,
}
export interface _SERVICE extends Backend {}
