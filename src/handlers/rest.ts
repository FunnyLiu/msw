import { match } from 'node-match-path'
import { RequestHandler, ResponseResolver } from './requestHandler'
import { Mask } from '../composeMocks'
import { set } from '../context/set'
import { status } from '../context/status'
import { body } from '../context/body'
import { text } from '../context/text'
import { json } from '../context/json'
import { xml } from '../context/xml'
import { delay } from '../context/delay'

export enum RESTMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  DELETE = 'DELETE',
}

interface RestHandlerContext {
  set: typeof set
  status: typeof status
  body: typeof body
  text: typeof text
  json: typeof json
  xml: typeof xml
  delay: typeof delay
}

const createRESTHandler = (method: RESTMethods) => {
  return (
    mask: Mask,
    resolver: ResponseResolver<RestHandlerContext>,
  ): RequestHandler<RestHandlerContext> => {
    return {
      mask,
      predicate(req) {
        const hasSameMethod = method === req.method
        const urlMatch = match(mask, req.url)

        return hasSameMethod && urlMatch.matches
      },
      defineContext() {
        return {
          set,
          status,
          body,
          text,
          json,
          xml,
          delay,
        }
      },
      resolver,
    }
  }
}

export default {
  get: createRESTHandler(RESTMethods.GET),
  post: createRESTHandler(RESTMethods.POST),
  put: createRESTHandler(RESTMethods.PUT),
  delete: createRESTHandler(RESTMethods.DELETE),
  patch: createRESTHandler(RESTMethods.PATCH),
  options: createRESTHandler(RESTMethods.OPTIONS),
}
