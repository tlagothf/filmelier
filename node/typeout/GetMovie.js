import Mysql from "./config/mysql.js";
class GetMovie {
    constructor() {
        const db = new Mysql();
        this.conn = db.init();
    }
    /**
     * 영화 제목을 받아서 영화 이름과 사진 dataBuffer를 JSON으로 반환하는 함수
     * @param movieName
     */
    getMovieInfo(movieName) {
        return new Promise((resolve, reject) => {
            const sql = 'select movie_name, movie_image from movie_info where movie_name like ?';
            const queryParam = `%${movieName}%`; // 부분 일치 검색
            this.conn.query(sql, queryParam, (err, results) => {
                if (err) {
                    return reject(err); // 오류 발생 시 reject 로 전달
                }
                if (results.length > 0) {
                    // 영화 이름과 이미지를 객체 배열로 생성
                    const moviesInfo = results.map((row) => ({
                        name: row.movie_name,
                        image: row.movie_image,
                    }));
                    // 객체 배열을 콜백으로 전달
                    resolve(moviesInfo); // [{ name: "마션", image: "마션.jsp"}...]
                }
                else {
                    // 영화가 없을 경우 Promise 거부
                    reject(new Error("해당하는 영화를 찾을 수 없습니다"));
                }
            });
        });
    }
    getSimilarMovieInfo(movieKeys) {
        return new Promise((resolve, reject) => {
            const sql = 'select movie_name, movie_image from movie_info where movie_name in (?)';
            this.conn.query(sql, [movieKeys], (err, results) => {
                if (err) {
                    return reject(err);
                }
                if (results.length > 0) {
                    const movieInfo = results.map((row) => ({
                        name: row.movie_name,
                        image: row.movie_image,
                    }));
                    resolve(movieInfo);
                }
                else {
                    reject(new Error("해당하는 영화를 찾을 수 없습니다"));
                }
            });
        });
    }
}
export default GetMovie;
/*
let db = new Mysql()
const conn = db.init()

// 값을 err 또는 null,result 로 전달
// err 가 안뜨면 null 을 반환, result 와 함께 반환 한다.
// err 가 뜨면 result 를 반환 하지 않기 위해 result? 를 사용
export const getMovieInfo = (movieName: string, callback : (err: Error | null, result ?: any) => void)=>{
    const sql = 'select movie_name, movie_image from movie_info where movie_name like ?';
    const queryParam = `%${movieName}%`; // 부분 일치 검색

    conn.query(sql, [queryParam], (err: Error, results: any) =>{
        if (err) {
            return callback(err); // 오류 발생 시 콜백 으로 전달
        }

        if (results.length > 0 ) {
            // 영화 이름과 이미지를 객체 배열로 생성
            const moviesInfo = results.map((row: any) =>({
                name: row.movie_name,
                image: row.movie_image,
            }));

            // 객체 배열을 콜백으로 전달
            callback(null, moviesInfo); // [{ name: "마션", image: "마션.jsp"}...]
        } else {
            callback(new Error("해당하는 영화를 찾을 수 없습니다"));
        }

    })
}
*/ 
