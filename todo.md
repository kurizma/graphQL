Basic user identification ✅
XP amount ✅

grades
audits
skills


gQL query
{
	user {
    id
    firstName
    lastName
    email
  }
  transaction(where: { type: { _eq: "xp" } }) {
    type
    amount
  }
}

  audit {
    auditorLogin
    auditor {
      id
    }
    grade
    createdAt
    endAt
    result {
      id
    }
  }

  look at path


  	progress(
    where: { eventId: { _eq: 104}}
  ) {
    isDone
		grade
  }
  
  event {
    progressesByEventid(where: { id: { _eq: 104 }}) {
      userLogin
    }
  }
