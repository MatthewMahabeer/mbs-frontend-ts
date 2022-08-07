import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.page}>
      <Head>
        <title>Telentio Home</title>
      </Head>
      <div className={styles.dashboard}>
        <div className={styles.top}>
          <div className={styles.dashboardheader}>Dashboard</div>
          <div className={styles.search}>
            <input className={styles.i} type="text" placeholder="Search" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
