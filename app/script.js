import AragonApi from '@aragon/api'

const api = new AragonApi()

const initialState = {
  dummyValue: 0,
}

api.store((state, event) => {
  if (state === null) state = initialState

  switch (event.event) {
    case 'DummyEvent':
      return { dummyValue: 1 }
    default:
      return state
  }
})
