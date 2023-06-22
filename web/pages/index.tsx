interface HomeProps {
  users: number;
}

export default function Home(props: HomeProps) {
  
  return (
    <h1>
      Usuários: {props.users}
    </h1>
  )
}

export const getServerSideProps = async () => {
  const response = await fetch('http://localhost:3333/test')
  const data = await response.json()

  //console.log(data)

  return {
    props: {
      users: data.users,
    }
  }

}
