
module.exports = {
  UpdateComment: `mutation UpdateComment(
  $input: UpdateCommentInput!
  $condition: ModelCommentConditionInput) {
  updateComment(input: $input, condition: $condition) {
      id
      content
      atendee {
        id
        meetingAlias
      }
      sentiment
      entities
      keyPhrases
      language
      translation
      createdAt
      commentMeetingId
  }
}`,
ListMeetings:  `query ListMeetings( 
  $filter: ModelMeetingFilterInput 
  $limit: Int
  $nextToken: String
) {
  listMeetings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      meetingChimeId
      atendees {
        nextToken
      }
      comments {
        nextToken
      }
      createdAt
    }
    nextToken
  }
}
`
}