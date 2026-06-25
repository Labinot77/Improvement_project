import PageHeader from '../components/Header/Page_header'

const page = () => {
  return (
        <div className="min-h-screen px-4 py-6 sm:px-8 sm:py-8">
               <div className="mx-auto max-w-7xl flex flex-col gap-6">
                <PageHeader
                  emoji="😴"
                  title="Finance"
                  subtitle="Net worth & spending"
                  backHref="/"
                />
              </div>
            </div>
  )
}

export default page