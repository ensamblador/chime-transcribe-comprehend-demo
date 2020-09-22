/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($commentMeetingId: String) {
    onCreateComment(commentMeetingId: $commentMeetingId) {
      id
      content
      atendee {
        id
        meetingAlias
        meetings {
          id
          meetingChimeId
          createdAt
        }
        comments {
          nextToken
        }
        createdAt
      }
      meeting {
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
      sentiment
      entities
      keyPhrases
      createdAt
      commentMeetingId
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($commentMeetingId: String) {
    onUpdateComment(commentMeetingId: $commentMeetingId) {
      id
      content
      atendee {
        id
        meetingAlias
        meetings {
          id
          meetingChimeId
          createdAt
        }
        comments {
          nextToken
        }
        createdAt
      }
      meeting {
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
      sentiment
      entities
      keyPhrases
      createdAt
      commentMeetingId
    }
  }
`;
export const onCreateAtendee = /* GraphQL */ `
  subscription OnCreateAtendee {
    onCreateAtendee {
      id
      meetingAlias
      meetings {
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
      comments {
        items {
          id
          content
          sentiment
          entities
          keyPhrases
          createdAt
          commentMeetingId
        }
        nextToken
      }
      createdAt
    }
  }
`;
export const onUpdateAtendee = /* GraphQL */ `
  subscription OnUpdateAtendee {
    onUpdateAtendee {
      id
      meetingAlias
      meetings {
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
      comments {
        items {
          id
          content
          sentiment
          entities
          keyPhrases
          createdAt
          commentMeetingId
        }
        nextToken
      }
      createdAt
    }
  }
`;
export const onDeleteAtendee = /* GraphQL */ `
  subscription OnDeleteAtendee {
    onDeleteAtendee {
      id
      meetingAlias
      meetings {
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
      comments {
        items {
          id
          content
          sentiment
          entities
          keyPhrases
          createdAt
          commentMeetingId
        }
        nextToken
      }
      createdAt
    }
  }
`;
