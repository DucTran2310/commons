import exampleSaga from '@/store/features/examples/example.saga'
import { all } from 'redux-saga/effects'

export default function* rootSaga() {
  yield all([
    exampleSaga(),
    // Thêm các saga khác ở đây
  ])
}