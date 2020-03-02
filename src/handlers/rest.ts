import { match } from 'node-match-path'
import { RequestHandler, ResponseResolver } from './requestHandler'
import { Mask } from '../composeMocks'

export enum RESTMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  DELETE = 'DELETE',
}

const createRESTHandler = (method: RESTMethods) => {
  return (mask: Mask, resolver: ResponseResolver): RequestHandler => {
    return {
      mask,
      predicate(req) {
        const hasSameMethod = method === req.method
        const urlMatch = match(mask, req.url)

        return hasSameMethod && urlMatch.matches
      },
      resolver,
    }
  }
}

const restMethods = {
  get: createRESTHandler(RESTMethods.GET),
  post: createRESTHandler(RESTMethods.POST),
  put: createRESTHandler(RESTMethods.PUT),
  delete: createRESTHandler(RESTMethods.DELETE),
  patch: createRESTHandler(RESTMethods.PATCH),
  options: createRESTHandler(RESTMethods.OPTIONS),
}

export default restMethods
