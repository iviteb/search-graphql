import * as TypeMoq from 'typemoq'
import { CategoryTreeSegmentsFinder } from "./CategoryTreeSegmentsFinder"
import { VBase } from "@vtex/api"
import { Search } from "../clients/search"


/*  CategoryTree 
 *         c0 
 *        / \  
 *      c1   c2 
 *     / \      
 *   c3   c4
 *         \
 *          c5
 */


const c5 = {
  name: 'c5',
  children: []
}

const c4 = {
  name: 'c4',
  children: [c5]
}

const c3 = {
  name: 'c3',
  children: []
}

const c2 = {
  name: 'c2',
  children: []
}

const c1 = {
  name: 'c1',
  children: [c3, c4]
}

const c0 = {
  name: 'c0',
  children: [c1, c2]
}


describe('Category Tree Search tests', () => {
  const vbaseMock = TypeMoq.Mock.ofType<VBase>()
  const searchMock = TypeMoq.Mock.ofType<Search>()
  const finder = class CategoryTreeSegmentsFinderMock extends CategoryTreeSegmentsFinder {
    constructor(segments: string[]){
      super({vbase: vbaseMock.object, search: searchMock.object}, segments)
    }
  }

  test('It should find a complete tree of categories', () => {
    const result = finder.find([c0] as CategoryTreeResponse[], '/c0/c1/c4')
    expect(result).toStrictEqual([c0, c1, c4])
  })

  test('It should find the maximum categories possible ', () => {
    const result = categoryTreeSearch([c0] as CategoryTreeResponse[], '/c0/c1/c2')
    expect(result).toStrictEqual([c0, c1])
  })

  test('It should not find when doesnt exist', () => {
    const result = categoryTreeSearch([c0] as CategoryTreeResponse[], '/x/c1/c4')
    expect(result).toStrictEqual([])
  })
})