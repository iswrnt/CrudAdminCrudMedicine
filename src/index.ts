import Express from "express"
import MedicineRoute from "./router/medicineRouter"
import adminRouter from "./router/adminRouter"
import { uploadAdminPhoto } from "./middleware/uploadAdminPhoto"

const app = Express()
/**allow to read a body request with JSON format */
app.use(Express.json())

/** prefix for medicine route */
app.use(`/medicine`, MedicineRoute)

app.use(`/admin`, adminRouter)

const PORT = 1992
app.listen(PORT, () => { 
    console.log(`Sever DrugStore run on PORT ${PORT}`)
})