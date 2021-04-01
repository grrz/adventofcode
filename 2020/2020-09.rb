def _input()
	f = File.open('2020-09-input')
	f.read.split("\n").map(&:to_i)
end

def test(data)
	for i in 25..data.size-1
		pre = data[i-25..i-1].permutation(2).map(&:sum)
		return i until pre.index(data[i])
	end
end

def cont(data, v)
	for n in 2..data.size-2
		pp "test #{n}…"
		for i in 0..data.size-1-n
			return data[i..i+n-1] if data[i..i+n-1].sum == v
		end
	end
end

d = _input()
# i = test(d)
# pp "#{i}: #{d[i]}"

# "617: 731031916"
# pp d[0..616]
r = cont(d[0..616], 731031916)
pp r.min + r.max
