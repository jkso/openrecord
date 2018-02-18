// var should = require('should')

describe('GraphQL: Mutation', function(){
  var database = 'attributes'
  var store


  before(function(next){
    beforeGraphQL(database, function(_store){
      store = _store
      next()
    })
  })

  after(function(){
    afterGraphQL(database)
  })



  it('executes a mutation and returns the id', function(){
    return store.ready(function(){
      return store.query(`
        mutation Test{
          createRecipe(input: {title: "Mutation Test", description: "Foobar", author_id: 1}) {
            id
          }
        }
      `, {id: 1})
      .then(function(result){
        result.should.be.eql({
          data: {
            createRecipe: {
              id: 5
            }
          }
        })
      })
    })
  })



  it('executes a mutation and returns the whole record + relational data', function(){
    return store.ready(function(){
      return store.query(`
        mutation Test{
          createRecipe(input: {title: "Mutation Test2", description: "Foobar", author_id: 1}) {
            id
            title
            author_id
            author{
              name
            }
          }
        }
      `, {id: 1})
      .then(function(result){
        result.should.be.eql({
          data: {
            createRecipe: {
              id: 6,
              title: 'Mutation Test2',
              author_id: 1,
              author: {
                name: 'phil'
              }
            }
          }
        })
      })
    })
  })



  it('executes a mutation with custom handler', function(){
    return store.ready(function(){
      return store.query(`
        mutation Test{
          updateRecipe(input: {id: 5, title: "Updated"}) {
            id
            title
            author_id
            author{
              name
            }
          }
        }
      `, {id: 1})
      .then(function(result){
        result.should.be.eql({
          data: {
            updateRecipe: {
              id: 5,
              title: 'Updated',
              author_id: 1,
              author: {
                name: 'phil'
              }
            }
          }
        })
      })
    })
  })



  it('executes a mutation with custom return type', function(){
    return store.ready(function(){
      return store.query(`
        mutation Test{
          destroyRecipe(input: {id: 5})
        }
      `, {id: 1})
      .then(function(result){
        result.should.be.eql({
          data: {
            destroyRecipe: true
          }
        })
      })
    })
  })



  it('executes a mutation defined in the model and returns related data', function(){
    return store.ready(function(){
      return store.query(`
        mutation Test{
          createAuthor(input: {name: "Max", email: "max@openrecord.com"}) {
            id
            name
            email
            active
            recipes{
              id
              title
            }
          }
        }
      `, {id: 1})
      .then(function(result){
        result.should.be.eql({
          data: {
            createAuthor: {
              id: 4,
              name: 'Max',
              email: 'max@openrecord.com',
              active: true,
              recipes: [
                { id: 7, title: 'Example recipe' }
              ]
            }
          }
        })
      })
    })
  })
})
