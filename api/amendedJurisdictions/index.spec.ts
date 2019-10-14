import * as chai from 'chai'
import { expect } from 'chai'
import 'mocha'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import { mockReq, mockRes } from 'sinon-express-mock'

chai.use(sinonChai)

import { config } from '../config'
import {http} from '../lib/http'
import * as amendedJurisdictions from './index'

describe('proxy', () => {

  let next
  let sandbox
  let req
  let res
  let result0
  let result1
  let spy: any

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    result0 = {
        data: [
            {
                id: 'PROBATE',
            },
            {
                id: 'data',
            },
        ],
    }

    result1 = {
        data: [
            {
                id: 'data',
            },
        ],
    }

    next = sandbox.spy()
    res = mockRes()
    req = mockReq({
      baseUrl: '/api/documents/',
      cookies: [],
      headers: {
        'accept': '*/*',
        'content-type': 'text/test',
        'experimental': 'experiment/test',
      },
      session: {
        save: fun => {
          fun()
        },
      },
      url: 'fdafu4543543/binary',
    })

  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should set content type', () => {
    req.headers.accept = false
    req.headers.experimental = false
    const headers = amendedJurisdictions.setHeaders(req)
    expect(headers).to.deep.equal({ 'content-type': 'text/test' })
  })

  it('should return a headers object from request', () => {
    const headers = amendedJurisdictions.setHeaders(req)
    expect(headers).to.deep.equal(req.headers)
  })

  it('should jurisdictions proxy a get request and send PROBATE array', async () => {
    const url = `${config.services.ccd.componentApi}${req.baseUrl}${req.url}`
    const expected = [
        {
            id: 'PROBATE',
        },
    ]

    spy = sandbox.stub(http, 'get').resolves(result0)
    await amendedJurisdictions.getJurisdictions(req, res)
    expect(spy).to.have.been.calledWith(url)
    expect(res.send).to.have.been.calledWith(expected)
  })

  it('should jurisdictions proxy a get request and send empty array', async () => {
    const url = `${config.services.ccd.componentApi}${req.baseUrl}${req.url}`
    const expected = []

    spy = sandbox.stub(http, 'get').resolves(result1)
    await amendedJurisdictions.getJurisdictions(req, res)
    expect(spy).to.have.been.calledWith(url)
    expect(res.send).to.have.been.calledWith(expected)
  })

  it('should catch any errors upon jurisdictions proxy get request', async () => {
    spy.restore()
    spy = sandbox.stub(http, 'get').throws({ response: { data: 'error occurred'}})
    await amendedJurisdictions.getJurisdictions(req, res)
    expect(res.send).to.have.been.calledWith('error occurred')
  })

})